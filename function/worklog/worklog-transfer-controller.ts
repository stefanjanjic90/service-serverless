import { LambdaHandler, LambdaContainer } from 'tyx';
import { ApplicationContainer } from '../../application-container';
import { WorklogTransferControllerService } from '../../service/worklog';
import { WorklogTimeTransactionProxy } from '../../service/orm/worklog-time-transaction';
import { TempoHttpClientProxy } from '../../service/http-client/tempo-http-client';
import { StateMachineService } from '../../service/state-machine';
import { WorklogProxy } from '../../service/orm/worklog'
import { WorklogTransferProxy } from '../../service/orm/worklog-transfer'

let container = new ApplicationContainer();

container.onInitialization = (lambdaContainer: LambdaContainer) => {
    lambdaContainer
        .register(WorklogTimeTransactionProxy)
        .register(WorklogProxy)
        .register(WorklogTransferProxy)
        .register(TempoHttpClientProxy)
        .register(StateMachineService)
        .publish(WorklogTransferControllerService);
}
export const handler: LambdaHandler = container.export();


