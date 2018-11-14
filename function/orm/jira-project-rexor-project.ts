import { LambdaHandler, LambdaContainer } from 'tyx';
import { ApplicationContainer } from '../../application-container';
import { DatabaseManagerService, JiraProjectRexorProjectService } from '../../service/orm';

let container = new ApplicationContainer();

container.onInitialization = (lambdaContainer: LambdaContainer) => {
    lambdaContainer
        .register(DatabaseManagerService)
        .publish(JiraProjectRexorProjectService);
}

export const handler: LambdaHandler = container.export();