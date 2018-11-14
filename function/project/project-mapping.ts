import { LambdaHandler, LambdaContainer } from 'tyx';
import { ApplicationContainer } from '../../application-container';
import { ProjectMappingLoggerApi } from '../../api/logger';
import { JiraProjectRexorProjectProxy, AuthenticationTokenProxy } from '../../service/orm';
import { LoggerFactory } from '../../service/logger';
import { ConnectorFactory } from '../../service/connector';
import { HttpClientFactory } from '../../service/http-client';
import { JiraConnectorApi, RexorConnectorApi } from '../../api/connector';
import { JiraHttpClientApi, RexorHttpClientApi } from '../../api/http-client';
import { JiraProjectService, RexorProjectService, ProjectMappingService } from '../../service/project';

let container = new ApplicationContainer();

container.onInitialization = (lambdaContainer: LambdaContainer) => {
    lambdaContainer
        .register(LoggerFactory.create(ProjectMappingLoggerApi), ProjectMappingLoggerApi)
        .register(JiraProjectRexorProjectProxy)
        .register(AuthenticationTokenProxy)
        .register(ConnectorFactory.create(JiraConnectorApi), JiraConnectorApi)
        .register(ConnectorFactory.create(RexorConnectorApi), RexorConnectorApi)
        .register(HttpClientFactory.create(JiraHttpClientApi), JiraHttpClientApi)
        .register(HttpClientFactory.create(RexorHttpClientApi), RexorHttpClientApi)
        .register(JiraProjectService)
        .register(RexorProjectService)
        .publish(ProjectMappingService);
}

export const handler: LambdaHandler = container.export();


