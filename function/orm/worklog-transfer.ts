import { LambdaHandler, LambdaContainer } from 'tyx';
import { ApplicationContainer } from '../../application-container';
import { DatabaseManagerService, WorklogTransferService } from '../../service/orm';

let container = new ApplicationContainer();

container.onInitialization = (lambdaContainer: LambdaContainer) => {
    lambdaContainer
        .register(DatabaseManagerService)
        .publish(WorklogTransferService);
}

export const handler: LambdaHandler = container.export();