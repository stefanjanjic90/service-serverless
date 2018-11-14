import { LambdaHandler, LambdaContainer } from 'tyx';
import { ApplicationContainer } from '../../application-container';
import { DatabaseManagerService, IssueTimeCodeService } from '../../service/orm';

let container = new ApplicationContainer();

container.onInitialization = (lambdaContainer: LambdaContainer) => {
    lambdaContainer
        .register(DatabaseManagerService)
        .publish(IssueTimeCodeService);
}

export const handler: LambdaHandler = container.export();