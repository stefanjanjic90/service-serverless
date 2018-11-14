import { LambdaHandler, LambdaContainer } from 'tyx';
import { ApplicationContainer } from '../../application-container';
import { JiraProjectService } from '../../service/project';
import { ConnectorFactory } from '../../service/connector';
import { HttpClientFactory } from '../../service/http-client';
import { JiraConnectorApi } from '../../api/connector';
import { JiraHttpClientApi } from '../../api/http-client';
import { AuthenticationTokenProxy } from '../../service/orm';

let container = new ApplicationContainer();

container.onInitialization = (lambdaContainer: LambdaContainer) => {
  lambdaContainer
    .register(AuthenticationTokenProxy)
    .register(ConnectorFactory.create(JiraConnectorApi), JiraConnectorApi)
    .register(HttpClientFactory.create(JiraHttpClientApi), JiraHttpClientApi)
    .publish(JiraProjectService);
}

export const handler: LambdaHandler = container.export();