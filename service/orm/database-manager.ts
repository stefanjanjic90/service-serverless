import 'reflect-metadata';
import { Service, Private } from 'tyx';
import { createConnection, Connection, Repository } from 'typeorm';
import { DatabaseManagerApi } from '../../api/orm';
import { Environment } from '../../environment';
import {
    JiraProjectRexorProjectEntity,
    IssueTypeProjectActivityEntity,
    WorklogTimeTransactionEntity,
    WorklogEntity,
    WorklogTransferEntity,
    AuthenticationTokenEntity,
    AbsenceEntity,
    IssueTimeCodeEntity
} from '../../entity';

@Service(DatabaseManagerApi)
export class DatabaseManagerService implements DatabaseManagerApi {

    private connection: Connection;

    private jiraProjectRexorProjectRepository: Repository<JiraProjectRexorProjectEntity>
    private issueTypeProjectActivityRepository: Repository<IssueTypeProjectActivityEntity>
    private worklogTimeTransactionRepository: Repository<WorklogTimeTransactionEntity>
    private worklogRepository: Repository<WorklogEntity>
    private worklogTransferRepository: Repository<WorklogTransferEntity>
    private authenticationTokenRepository: Repository<AuthenticationTokenEntity>
    private absenceRepository: Repository<AbsenceEntity>
    private issueTimeCodeRepository: Repository<IssueTimeCodeEntity>

    public constructor() { }

    @Private()
    public async activate(): Promise<void> {
        try {
            let databaseConfiguration = {
                type: Environment.databaseType,
                entities: ["./entity/*.js"],
                username: Environment.databaseUsername,
                password: Environment.databasePassword,
                host: Environment.databaseEndpoint,
                port: Environment.databasePort,
                database: Environment.databaseName,
                synchronize: false,
                migrationsRun: false
            };
            this.connection = await createConnection(databaseConfiguration);
            this.jiraProjectRexorProjectRepository = this.connection.getRepository(JiraProjectRexorProjectEntity);
            this.issueTypeProjectActivityRepository = this.connection.getRepository(IssueTypeProjectActivityEntity);
            this.worklogTimeTransactionRepository = this.connection.getRepository(WorklogTimeTransactionEntity);
            this.worklogRepository = this.connection.getRepository(WorklogEntity);
            this.worklogTransferRepository = this.connection.getRepository(WorklogTransferEntity);
            this.authenticationTokenRepository = this.connection.getRepository(AuthenticationTokenEntity);
            this.absenceRepository = this.connection.getRepository(AbsenceEntity);
            this.issueTimeCodeRepository = this.connection.getRepository(IssueTimeCodeEntity);

        } catch (exception) {
            console.error('Database connection error.', exception);
            throw exception;
        }
    }

    @Private()
    public async release(): Promise<void> {
        this.jiraProjectRexorProjectRepository = undefined;
        this.issueTypeProjectActivityRepository = undefined;
        this.worklogTimeTransactionRepository = undefined;
        this.worklogRepository = undefined;
        this.worklogTransferRepository = undefined;
        this.authenticationTokenRepository = undefined;
        this.absenceRepository = undefined;
        this.issueTimeCodeRepository = undefined;

        try {
            await this.connection.close();
        } catch (exception) {
            console.error("Error while closing the connection.", exception);
        } finally {
            this.connection = undefined;
        }
    }

    public get JiraProjectRexorProjectRepository(): Repository<JiraProjectRexorProjectEntity> {
        return this.jiraProjectRexorProjectRepository;
    }

    public get IssueTypeProjectActivityRepository(): Repository<IssueTypeProjectActivityEntity> {
        return this.issueTypeProjectActivityRepository;
    }

    public get WorklogTimeTransactionRepository(): Repository<WorklogTimeTransactionEntity> {
        return this.worklogTimeTransactionRepository;
    }

    public get WorklogRepository(): Repository<WorklogEntity> {
        return this.worklogRepository;
    }

    public get WorklogTransferRepository(): Repository<WorklogTransferEntity> {
        return this.worklogTransferRepository;
    }

    public get AuthenticationTokenRepository(): Repository<AuthenticationTokenEntity> {
        return this.authenticationTokenRepository;
    }

    public get AbsenceRepository(): Repository<AbsenceEntity> {
        return this.absenceRepository;
    }

    public get IssueTimeCodeRepository(): Repository<IssueTimeCodeEntity> {
        return this.issueTimeCodeRepository;
    }
}