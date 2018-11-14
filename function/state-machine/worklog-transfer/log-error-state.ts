import { StateHandler } from '../../../service/state-machine';
import { LogErrorState } from '../../../service/state-machine/worklog-transfer';

let logErrorState: LogErrorState = new LogErrorState();

export const handler: StateHandler = logErrorState.exportHandler();