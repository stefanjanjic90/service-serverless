import { LambdaContainer } from 'tyx';
import { ApplicationContainer } from '../../../application-container';
import { StateHandler } from '../../../service/state-machine';
import { CountState } from '../../../service/state-machine/worklog-transfer';
import { WorklogTransferProxy } from '../../../service/orm';

let applicationContainer = new ApplicationContainer();

applicationContainer.onInitialization = (lambdaContainer: LambdaContainer) => {
    lambdaContainer.register(WorklogTransferProxy);
}

let countState: CountState = new CountState(applicationContainer.prepare());

export const handler: StateHandler = countState.exportHandler();