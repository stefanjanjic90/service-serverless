import { ContainerInstance } from 'tyx';
import { ApplicationContainer } from '../../../application-container';
import { State, StateEvent, StateContext, StateCallback } from '../state';
import { WorklogTransferApi } from '../../../api/orm';
import { TransferStatusCd } from '../../../constants/worklog';

export class CountState extends State {

    private worklogTransferProxy: WorklogTransferApi;

    constructor(containerInstance?: ContainerInstance) {
        super(containerInstance);
        this.worklogTransferProxy = this.containerInstance.get(ApplicationContainer.ApplicationName + ":" + WorklogTransferApi);
    }

    async handler(event: StateEvent, context: StateContext, callback: StateCallback) {
        try {
            let remainingWorklogs = await this.worklogTransferProxy.countWithOptions({ where: { transferStatusCd: TransferStatusCd.Ready } });
            console.info(`Remaining worklogs transfers: ${JSON.stringify(remainingWorklogs)}`);
            callback(null, remainingWorklogs);
        } catch (exception) {
            console.error(`Error occured while counting worklog transfers.`, exception);
            throw exception;
        }
    }
}




