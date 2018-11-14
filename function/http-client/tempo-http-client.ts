import { LambdaHandler, LambdaContainer } from 'tyx';
import { ApplicationContainer } from '../../application-container';
import { TempoHttpClientService } from '../../service/http-client/tempo-http-client';
import { TempoConnectorService } from '../../service/connector/tempo-connector';
import { AuthenticationTokenProxy } from '../../service/orm/authentication-token';
let container = new ApplicationContainer();

container.onInitialization = (lambdaContainer: LambdaContainer) => {
    lambdaContainer
        .register(AuthenticationTokenProxy)
        .register(TempoConnectorService)
        .publish(TempoHttpClientService);
}

export const handler: LambdaHandler = container.export();