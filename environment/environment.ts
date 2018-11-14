const environment = process.env;

/**
 *  Singleton class which loads up and wraps parameters from AWS Lambda function environment.
 *  Gives a typed access to properties through application for easier usage.
 */
class ProcessEnvironment {

    private static instance: ProcessEnvironment;

    public readonly region: string;
    public readonly stage: string;
    public readonly internalSecret: string;
    public readonly internalTimeout: string;

    public readonly webappUrl: string;
    public readonly apiGatewayUrl: string;
    public readonly applicationLogGroupName: string;
    public readonly projectMappingLogStreamName: string;
    public readonly issueTypeMappingLogStreamName: string;

    public readonly worklogTransferStateMachineName: string;
    public readonly worklogTransferStateMachineArn: string;
    public readonly worklogTransferStateMachineExecutionNamePrefix: string;

    public readonly databaseEndpoint: string;
    public readonly databasePort: number;
    public readonly databaseUsername: string;
    public readonly databasePassword: string;
    public readonly databaseName: string;
    public readonly databaseType: CustomEnvironmentTypes.DatabaseType;

    public readonly jiraApiUrl: string;

    public readonly tempoApiUrl: string;
    public readonly companyDomainJiraDomainBaseUrl: string;

    public readonly rexorApiUrl: string;
    public readonly rexorAuthConfigClientId: string;
    public readonly rexorAuthConfigGrantType: string;
    public readonly rexorAuthConfigUsername: string;
    public readonly rexorAuthConfigPassword: string;
    public readonly rexorAuthConfigAuthenticationUrl: string;

    public readonly azureJwksUrl: string;
    public readonly azureLogoutUrl: string;
    public readonly azureAuthConfigIdentityMetadata: string;
    public readonly azureAuthConfigClientID: string;
    public readonly azureAuthConfigResponseType: string;
    public readonly azureAuthConfigResponseMode: string;
    public readonly azureAuthConfigAllowHttpForRedirectUrl: boolean;
    public readonly azureAuthConfigClientSecret: string;
    public readonly azureAuthConfigValidateIssuer: boolean;
    public readonly azureAuthConfigIsB2C: boolean;
    public readonly azureAuthConfigPassReqToCallback: boolean;
    public readonly azureAuthConfigScopeOpenId: string;
    public readonly azureAuthConfigScopeOfflineAccess: string;
    public readonly azureAuthConfigLoggingLevel: string;
    public readonly azureAuthConfigNonceMaxAmount: number;
    public readonly azureAuthConfigUseCookieInsteadOfSession: boolean;
    public readonly azureAuthConfigCookieEncryptionKey1: string;
    public readonly azureAuthConfigCookieEncryptionKey2: string;
    public readonly azureAuthConfigCookieEncryptionIv1: string;
    public readonly azureAuthConfigCookieEncryptionIv2: string;

    private constructor() {

        this.region = environment.REGION;
        this.stage = environment.STAGE;
        this.internalSecret = environment.INTERNAL_SECRET;
        this.internalTimeout = environment.INTERNAL_TIMEOUT;

        this.webappUrl = environment.webappUrl;
        this.apiGatewayUrl = environment.apiGatewayUrl
        this.applicationLogGroupName = environment.applicationLogGroupName;
        this.projectMappingLogStreamName = environment.projectMappingLogStreamName;
        this.issueTypeMappingLogStreamName = environment.issueTypeMappingLogStreamName;

        this.worklogTransferStateMachineName = environment.worklogTransferStateMachineName;
        this.worklogTransferStateMachineArn = environment.worklogTransferStateMachineArn;
        this.worklogTransferStateMachineExecutionNamePrefix = environment.worklogTransferStateMachineExecutionNamePrefix;

        this.databaseEndpoint = environment.databaseEndpoint;
        this.databasePort = this.toInteger(environment.databasePort);
        this.databaseUsername = environment.databaseUsername;
        this.databasePassword = environment.databasePassword;
        this.databaseName = environment.databaseName;
        this.databaseType = environment.databaseType;

        this.azureJwksUrl = environment.azureJwksUrl;
        this.azureLogoutUrl = environment.azureLogoutUrl;

        this.jiraApiUrl = environment.jiraApiUrl;
        this.tempoApiUrl = environment.tempoApiUrl;
        this.companyDomainJiraDomainBaseUrl = environment.companyDomainJiraDomainBaseUrl;

        this.rexorApiUrl = environment.rexorApiUrl;
        this.rexorAuthConfigClientId = environment.rexorAuthConfigClientId
        this.rexorAuthConfigGrantType = environment.rexorAuthConfigGrantType
        this.rexorAuthConfigUsername = environment.rexorAuthConfigUsername
        this.rexorAuthConfigPassword = environment.rexorAuthConfigPassword
        this.rexorAuthConfigAuthenticationUrl = environment.rexorAuthConfigAuthenticationUrl;

        this.azureAuthConfigIdentityMetadata = environment.azureAuthConfigIdentityMetadata;
        this.azureAuthConfigClientID = environment.azureAuthConfigClientID;
        this.azureAuthConfigResponseType = environment.azureAuthConfigResponseType;
        this.azureAuthConfigResponseMode = environment.azureAuthConfigResponseMode;
        this.azureAuthConfigAllowHttpForRedirectUrl = this.toBoolean(environment.azureAuthConfigAllowHttpForRedirectUrl);
        this.azureAuthConfigClientSecret = environment.azureAuthConfigClientSecret;
        this.azureAuthConfigValidateIssuer = this.toBoolean(environment.azureAuthConfigValidateIssuer);
        this.azureAuthConfigIsB2C = this.toBoolean(environment.azureAuthConfigIsB2C);
        this.azureAuthConfigPassReqToCallback = this.toBoolean(environment.azureAuthConfigPassReqToCallback);
        this.azureAuthConfigScopeOpenId = environment.azureAuthConfigScopeOpenId;
        this.azureAuthConfigScopeOfflineAccess = environment.azureAuthConfigScopeOfflineAccess;
        this.azureAuthConfigLoggingLevel = environment.azureAuthConfigLoggingLevel;
        this.azureAuthConfigNonceMaxAmount = this.toInteger(environment.azureAuthConfigNonceMaxAmount);
        this.azureAuthConfigUseCookieInsteadOfSession = this.toBoolean(environment.azureAuthConfigUseCookieInsteadOfSession)
        this.azureAuthConfigCookieEncryptionKey1 = environment.azureAuthConfigCookieEncryptionKey1;
        this.azureAuthConfigCookieEncryptionKey2 = environment.azureAuthConfigCookieEncryptionKey2;
        this.azureAuthConfigCookieEncryptionIv1 = environment.azureAuthConfigCookieEncryptionIv1;
        this.azureAuthConfigCookieEncryptionIv2 = environment.azureAuthConfigCookieEncryptionIv2;
    }

    public static get Instance() {
        return this.instance || (this.instance = new this());
    }

    private toBoolean(value: string) {
        return "true" == value.toLowerCase();
    }

    private toInteger(value: string) {
        let convertedValue = parseInt(value);
        if (convertedValue === NaN) {
            throw new Error(`Could not convert ${value} to integer.`);
        }
        return convertedValue;
    }
}

namespace CustomEnvironmentTypes {
    export type DatabaseType = "mysql";
}

export const Environment = ProcessEnvironment.Instance;