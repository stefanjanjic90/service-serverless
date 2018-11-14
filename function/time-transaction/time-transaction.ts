import { LambdaHandler, LambdaContainer } from 'tyx';
import { ApplicationContainer } from '../../application-container';
import { TimeTransactionService } from '../../service/time-transaction';
import { ConnectorFactory } from '../../service/connector';
import { RexorConnectorApi } from '../../api/connector';
import { HttpClientFactory } from '../../service/http-client';
import { RexorHttpClientApi } from '../../api/http-client';
import { AuthenticationTokenProxy } from '../../service/orm';

let container = new ApplicationContainer();

container.onInitialization = (lambdaContainer: LambdaContainer) => {
    lambdaContainer
        .register(AuthenticationTokenProxy)
        .register(ConnectorFactory.create(RexorConnectorApi), RexorConnectorApi)
        .register(HttpClientFactory.create(RexorHttpClientApi), RexorHttpClientApi)
        .publish(TimeTransactionService);
}
export const handler: LambdaHandler = container.export();


