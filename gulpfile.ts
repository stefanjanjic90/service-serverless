import { Gulpclass, Task, SequenceTask } from 'gulpclass';
import { CloudFormation } from 'aws-sdk';
import * as execSql from 'exec-sql';
import * as promptly from 'promptly';
import * as gulp from 'gulp';
import * as yargs from 'yargs';
import * as fs from 'fs';
import * as path from 'path';
import * as typedoc from "gulp-typedoc";


interface DatabaseCredentials {
    username: string,
    password: string
}

interface Environments {
    local: Environment,
    dev: Environment,
    stage: Environment
    prod: Environment
}
interface Environment {
    name: string,
    serviceStackName: string,
    databaseEndpoint: string,
    databasePort: number,
    databaseName: string,
}

const Environments: Environments = {
    local: <Environment>{
        name: 'local',
        serviceStackName: 'rexor-integration-service-local',
        databaseEndpoint: null,
        databasePort: null,
        databaseName: null
    },
    dev: <Environment>{
        name: 'dev',
        serviceStackName: 'rexor-integration-service-dev',
        databaseEndpoint: null,
        databasePort: null,
        databaseName: null
    },
    stage: <Environment>{
        name: 'stage',
        serviceStackName: 'rexor-integration-service-stage',
        databaseEndpoint: null,
        databasePort: null,
        databaseName: null
    },
    prod: <Environment>{
        name: 'prod',
        serviceStackName: 'rexor-integration-service-prod',
        databaseEndpoint: null,
        databasePort: null,
        databaseName: null
    }
}

interface CloudFormationOutputsMap {
    [key: string]: CloudFormation.Output;
}

@Gulpclass()
export class Gulpfile {

    private argv: any;
    private cloudFormation: CloudFormation;
    private environment: Environment;
    private databaseFolder = './db'
    private databaseScriptFolder = 'script'
    private databaseInstallFile = "install.sql"

    constructor() {
        this.argv = yargs.command('$0 <environment>', 'Gulp task runner.', {
            environment: {
                describe: 'Set environment for task execution.',
                type: 'string',
            }
        }).default('environment', Environments.local.name)
            .alias('e', 'environment')
            .argv;
        console.log(this.argv);
        this.environment = Environments[this.argv.environment];
        if (!this.environment) {
            throw new Error('Unknown environment.')
        }

        this.cloudFormation = new CloudFormation({ apiVersion: "2010-05-15", region: 'eu-west-1' });
    }

    @Task('typedoc')
    public typedoc() {
        return gulp
            .src(["./api/**/*.ts",
                "./application-container/**/*.ts",
                "./data/**/*.ts",
                "./entity/**/*.ts",
                "./environment/**/*.ts",
                "./exception/**/*.ts",
                "./function/**/*.ts",
                "./service/**/*.ts",
            ]).pipe(typedoc({
                module: "commonjs",
                target: "es5",
                out: "documents/",
                name: "rexor-integration-service",
                excludeExternals: true,
                externalPattern: "./node_modules/**",

            }))
    }

    @SequenceTask('deploy-database')
    public deployDatabase() {
        return ["initialize-environment", "install-all-sql-files"];
    }

    @SequenceTask('install-database-version')
    public installDatabaseVersion() {
        return ["initialize-environment", "install-sql-file"];
    }

    @Task('initialize-environment')
    public async initializeEnvironment() {
        return new Promise<any>(async (resolve, reject) => {
            try {
                let outputs = await this.getStackOutputs(this.environment.serviceStackName, ["DatabaseName", "DatabaseEndpoint", "DatabasePort"]);
                this.environment.databaseName = outputs.DatabaseName.OutputValue;
                this.environment.databasePort = parseInt(outputs.DatabasePort.OutputValue);
                this.environment.databaseEndpoint = outputs.DatabaseEndpoint.OutputValue;
            } catch (exception) {
                console.log("Error while getting stack outputs.", exception);
                reject(exception);
            }
            console.log(JSON.stringify(this.environment));
            resolve();
        });
    }

    @Task('install-sql-file')
    public async installSqlFile() {
        let databaseCredentials = await this.promptDatabaseCredentials();
        let versions = this.getDirectories(this.databaseFolder);

        console.log("Available versions:");
        for (const [index, version] of versions.entries()) {
            console.log(`${index + 1}) ${version}`);
        }

        let versionIndex = await promptly.prompt('Enter version number:');
        let sqlFilePath = this.getSqlFilePath(versions[versionIndex - 1]);

        this.databaseConnect(databaseCredentials);
        console.log(`Executing script: ${sqlFilePath}`);
        await execSql.executeFile(sqlFilePath);
        this.databaseDisconnect();
    }

    @Task('install-all-sql-files')
    public async installAllSqlFiles() {

        let databaseCredentials = await this.promptDatabaseCredentials();
        let versionDirectories = this.getDirectories(this.databaseFolder);
        let sqlFilePaths = this.getSqlFilePaths(versionDirectories);

        this.databaseConnect(databaseCredentials);
        for (let sqlFilePath of sqlFilePaths) {
            console.log(`Executing script: ${sqlFilePath}`);
            await execSql.executeFile(sqlFilePath);
        }
        this.databaseDisconnect();
    }

    private databaseConnect(databaseCredentials: DatabaseCredentials) {
        return execSql.connect({
            "database": "mysql",
            "host": this.environment.databaseEndpoint,
            "port": this.environment.databasePort,
            "user": databaseCredentials.username,
            "password": databaseCredentials.password
        });
    }

    private databaseDisconnect() {
        execSql.disconnect();
    }

    private async promptDatabaseCredentials(): Promise<DatabaseCredentials> {
        let databaseCredentials: DatabaseCredentials = {
            username: await promptly.prompt('Database username:'),
            password: await promptly.prompt('Database password:')
        }
        return databaseCredentials;
    }

    private getSqlFilePath(versionDirectory) {
        let versionPath = path.join(this.databaseFolder, versionDirectory);
        let scritpPath = path.join(versionPath, this.databaseScriptFolder);
        return path.join(scritpPath, this.databaseInstallFile);
    }

    private getSqlFilePaths(versionDirectories) {
        let sqlFilePaths = versionDirectories.map(versionDirectory => {
            return this.getSqlFilePath(versionDirectory);
        });
        return sqlFilePaths;
    }

    private getDirectories(directory) {
        const isDirectory = source => fs.lstatSync(source).isDirectory()
        return fs.readdirSync(directory).filter(name => {
            let directoryPath = path.join(directory, name);
            if (isDirectory(directoryPath)) {
                return true;
            }
            return false;
        }).sort();
    }

    private async getStackOutputs(stackName: string, outputKeys: string[]): Promise<CloudFormationOutputsMap> {
        return new Promise<CloudFormationOutputsMap>(async (resolve, reject) => {

            let describeStacksResponse;
            try {
                describeStacksResponse = await this.cloudFormation.describeStacks({ StackName: stackName }).promise();
            } catch (exception) {
                let errorMessage = "Describe stacks error.";
                console.log(errorMessage, exception);
                throw new Error(errorMessage);
            }

            let stack = describeStacksResponse.Stacks.filter((stack) => {
                return stack.StackName === stackName;
            })[0];

            if (!stack) {
                let errorMessage = 'Stack not found.'
                reject(errorMessage);
                throw new Error(errorMessage);
            }

            let outputsMap = {};
            for (let outputKey of outputKeys) {

                let output = stack.Outputs.filter((output) => {
                    return output.OutputKey === outputKey;
                })[0];

                if (!output) {
                    let errorMessage = 'Output not found.'
                    reject(errorMessage);
                    throw new Error(errorMessage);
                } else {
                    outputsMap[outputKey] = output;
                }
            }
            return resolve(outputsMap);
        });
    }
}