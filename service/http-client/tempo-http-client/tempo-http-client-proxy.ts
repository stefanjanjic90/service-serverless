import { Proxy, LambdaProxy } from 'tyx';
import { ApplicationContainer } from '../../../application-container';
import { TempoHttpClientApi } from '../../../api/http-client';

@Proxy(TempoHttpClientApi, ApplicationContainer.ApplicationName, TempoHttpClientApi)
export class TempoHttpClientProxy extends LambdaProxy implements TempoHttpClientApi {

    public async getWorklogs(dateFrom: string, dateTo: string, projectKey?: string): Promise<any> {
        return this.proxy(this.getWorklogs, arguments);
    }
}