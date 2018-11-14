import { Service } from 'tyx';
import { Company } from '../../data/rexor';

export const CompanyApi = "Company";

/**
 * Interfaces provides methods for working with Rexor companies and its related objects.
 */
export interface CompanyApi extends Service {

    /**
     * Requests a single Rexor company based on a provided uid. 
     * Transforms the HTTP response into Company object.
     * @param uid Unique identifer of company in Rexor.
     * @returns Promise of a Company object.
     */
    getCompany(uid: string): Promise<Company>;
}