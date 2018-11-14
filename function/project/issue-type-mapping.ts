import { LambdaHandler, LambdaContainer } from 'tyx';
import { ApplicationContainer } from '../../application-container';
import { JiraProjectRexorProjectProxy, IssueTypeProjectActivityProxy, AuthenticationTokenProxy } from '../../service/orm';
import { IssueTypeMappingLoggerApi } from '../../api/logger';
import { LoggerFactory } from '../../service/logger';
import { ConnectorFactory } from '../../service/connector';
import { HttpClientFactory } from '../../service/http-client';
import { JiraConnectorApi, RexorConnectorApi } from '../../api/connector';
import { JiraHttpClientApi, RexorHttpClientApi } from '../../api/http-client';
import { JiraProjectService, RexorProjectService, IssueTypeMappingService } from '../../service/project';

let container = new ApplicationContainer();

container.onInitialization = (lambdaContainer: LambdaContainer) => {
    lambdaContainer
        .register(LoggerFactory.create(IssueTypeMappingLoggerApi), IssueTypeMappingLoggerApi)
        .register(JiraProjectRexorProjectProxy)
        .register(IssueTypeProjectActivityProxy)
        .register(AuthenticationTokenProxy)
        .register(ConnectorFactory.create(JiraConnectorApi), JiraConnectorApi)
        .register(ConnectorFactory.create(RexorConnectorApi), RexorConnectorApi)
        .register(HttpClientFactory.create(JiraHttpClientApi), JiraHttpClientApi)
        .register(HttpClientFactory.create(RexorHttpClientApi), RexorHttpClientApi)
        .register(JiraProjectService)
        .register(RexorProjectService)
        .publish(IssueTypeMappingService);
}

export const handler: LambdaHandler = container.export();