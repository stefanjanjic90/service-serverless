import { LambdaHandler, LambdaContainer } from 'tyx';
import { ApplicationContainer } from '../../application-container';
import { DatabaseManagerService, AbsenceService } from '../../service/orm';

let container = new ApplicationContainer();

container.onInitialization = (lambdaContainer: LambdaContainer) => {
    lambdaContainer
        .register(DatabaseManagerService)
        .publish(AbsenceService);
}

export const handler: LambdaHandler = container.export();