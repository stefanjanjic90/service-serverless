import { LambdaHandler, LambdaContainer } from 'tyx';
import { ApplicationContainer } from '../../application-container';
import { PersonService } from '../../service/person';
import { ConnectorFactory } from '../../service/connector';
import { HttpClientFactory } from '../../service/http-client';
import { RexorConnectorApi } from '../../api/connector';
import { RexorHttpClientApi } from '../../api/http-client';
import { AuthenticationTokenProxy } from '../../service/orm';

let container = new ApplicationContainer();

container.onInitialization = (lambdaContainer: LambdaContainer) => {
    lambdaContainer
        .register(AuthenticationTokenProxy)
        .register(ConnectorFactory.create(RexorConnectorApi), RexorConnectorApi)
        .register(HttpClientFactory.create(RexorHttpClientApi), RexorHttpClientApi)
        .publish(PersonService);
}

export const handler: LambdaHandler = container.export();