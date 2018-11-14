import { LambdaHandler, LambdaContainer } from 'tyx';
import { ApplicationContainer } from '../../application-container';
import { AuthService } from '../../service/security';

let container = new ApplicationContainer();

container.onInitialization = (lambdaContainer: LambdaContainer) => {
  lambdaContainer.publish(AuthService);
}

export const handler: LambdaHandler = container.export();