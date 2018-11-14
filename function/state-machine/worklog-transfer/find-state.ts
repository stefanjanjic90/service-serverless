import { LambdaContainer } from 'tyx';
import { ApplicationContainer } from '../../../application-container';
import { StateHandler } from '../../../service/state-machine';
import { FindState } from '../../../service/state-machine/worklog-transfer';
import { WorklogTransferProxy } from '../../../service/orm';

let applicationContainer = new ApplicationContainer();

applicationContainer.onInitialization = (lambdaContainer: LambdaContainer) => {
    lambdaContainer.register(WorklogTransferProxy);
}

let findState: FindState = new FindState(applicationContainer.prepare());

export const handler: StateHandler = findState.exportHandler(); 
