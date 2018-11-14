import { Proxy, LambdaProxy } from 'tyx';
import { ApplicationContainer } from '../../application-container';
import { CompanyApi } from '../../api/company';
import { Company } from '../../data/rexor';

@Proxy(CompanyApi, ApplicationContainer.ApplicationName, CompanyApi)
export class CompanyProxy extends LambdaProxy implements CompanyApi {

    public async getCompany(uid: string): Promise<Company> {
        return this.proxy(this.getCompany, arguments);
    }
}








