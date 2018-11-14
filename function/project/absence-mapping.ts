import { LambdaHandler, LambdaContainer } from 'tyx';
import { ApplicationContainer } from '../../application-container';
import { AbsenceProxy, JiraProjectRexorProjectProxy, IssueTimeCodeProxy } from '../../service/orm';
import { AbsenceMappingService } from '../../service/project';

let container = new ApplicationContainer();

container.onInitialization = (lambdaContainer: LambdaContainer) => {
    lambdaContainer
        .register(AbsenceProxy)
        .register(IssueTimeCodeProxy)
        .register(JiraProjectRexorProjectProxy)
        .publish(AbsenceMappingService);
}

export const handler: LambdaHandler = container.export();