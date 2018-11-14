import { LambdaContainer } from 'tyx';
import { ApplicationContainer } from '../../../application-container';
import { StateHandler } from '../../../service/state-machine';
import { TransferState } from '../../../service/state-machine/worklog-transfer';
import { WorklogTransferProxy, WorklogTimeTransactionProxy, JiraProjectRexorProjectProxy, IssueTypeProjectActivityProxy, AbsenceProxy } from '../../../service/orm';
import { JiraProjectProxy, RexorProjectProxy } from '../../../service/project';
import { CompanyProxy } from '../../../service/company';
import { PersonProxy } from '../../../service/person';
import { TimeTransactionProxy } from '../../../service/time-transaction';

let applicationContainer = new ApplicationContainer();

applicationContainer.onInitialization = (lambdaContainer: LambdaContainer) => {
    lambdaContainer.register(WorklogTransferProxy);
    lambdaContainer.register(WorklogTimeTransactionProxy);
    lambdaContainer.register(JiraProjectRexorProjectProxy);
    lambdaContainer.register(IssueTypeProjectActivityProxy);
    lambdaContainer.register(JiraProjectProxy);
    lambdaContainer.register(RexorProjectProxy);
    lambdaContainer.register(CompanyProxy);
    lambdaContainer.register(PersonProxy);
    lambdaContainer.register(TimeTransactionProxy);
    lambdaContainer.register(AbsenceProxy);
}

let transferState: TransferState = new TransferState(applicationContainer.prepare());

export const handler: StateHandler = transferState.exportHandler();