import { Service, Inject, Internal } from 'tyx';
import { CompanyApi } from '../../api/company';
import { RexorHttpClientApi } from '../../api/http-client';
import { Company } from '../../data/rexor';
import { InternalErrorException } from '../../exception';

@Service(CompanyApi)
export class CompanyService implements CompanyApi {

    @Inject(RexorHttpClientApi)
    private rexorHttpClient: RexorHttpClientApi;

    @Internal()
    public async getCompany(uid: string): Promise<Company> {
        try {
            let companyResponse = await this.rexorHttpClient.getCompany(uid);

            let companyData = companyResponse.body;
            let company: Company = {
                uid: companyData.UID,
                id: companyData.ID
            };

            return company;
        } catch (exception) {
            console.error('Error while retrieving company from Rexor.', exception);
            let internalErrorException = new InternalErrorException(exception);
            throw internalErrorException.convertToTyxException();
        }
    }
}