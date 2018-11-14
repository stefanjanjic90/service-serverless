import { ContainerInstance } from 'tyx';
import { ApplicationContainer } from '../../../application-container';
import { State, StateEvent, StateContext, StateCallback } from '../state';
import { WorklogTransferApi } from '../../../api/orm';
import { TransferStatusCd } from '../../../constants/worklog';
import { ReadyWorklogTransferNotFoundException } from '../../../exception/worklog-transfer';
import * as _ from 'lodash';

export class FindState extends State {

    private worklogTransferProxy: WorklogTransferApi;

    constructor(containerInstance?: ContainerInstance) {
        super(containerInstance);
        this.worklogTransferProxy = this.containerInstance.get(ApplicationContainer.ApplicationName + ":" + WorklogTransferApi);
    }

    async handler(event: StateEvent, context: StateContext, callback: StateCallback) {
        try {
            let worklogTransferEntity = await this.worklogTransferProxy.queryOneByColumn({ transferStatusCd: TransferStatusCd.Ready });
            if (_.isEmpty(worklogTransferEntity)) {
                throw new ReadyWorklogTransferNotFoundException();
            }
            console.info(`Found worklog transfer: ${JSON.stringify(worklogTransferEntity)}`);
            callback(null, worklogTransferEntity);
        } catch (exception) {
            console.error(`Error occured while finding worklog transfer.`, exception);
            throw exception;
        }
    }
}