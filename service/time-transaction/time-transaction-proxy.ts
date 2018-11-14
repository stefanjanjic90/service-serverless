import { Proxy, LambdaProxy } from 'tyx';
import { ApplicationContainer } from '../../application-container';
import { TimeTransactionApi } from '../../api/time-transaction';
import { TimeTransaction } from '../../data/rexor';

@Proxy(TimeTransactionApi, ApplicationContainer.ApplicationName, TimeTransactionApi)
export class TimeTransactionProxy extends LambdaProxy implements TimeTransactionApi {

    public async save(timeTransaction: TimeTransaction): Promise<TimeTransaction> {
        return this.proxy(this.save, arguments);
    }
}








