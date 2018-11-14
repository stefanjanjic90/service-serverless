import { HttpClientApi } from './http-client';
import { TimeTransaction } from '../../data/rexor';

export const RexorHttpClientApi = "RexorHttpClient";

/**
 * HTTP Client interface for Rexor API.
 */
export interface RexorHttpClientApi extends HttpClientApi {

    /**
     * Requests all available Rexor projects for a user(resource) defined in the environment.
     * @returns Promise of a Rexor projects HTTP response.
     */
    getProjects(): Promise<any>;

    /**
     * Requests a project activity based on a provided UID.
     * @param uid Project Activity unique identifier.
     * @returns Promise of a Rexor project activity HTTP response.
     */
    getProjectActivity(uid: string): Promise<any>;

    /**
     * Requests a project based on a provided UID.
     * @param uid Project unique identifier.
     * @returns Promise of a Rexor project HTTP response.
     */
    getProject(uid: string): Promise<any>;

    /**
     * Requests all project activities on a Rexor project for a given company.
     * @param companyId Identifier of the company to which the project belongs.
     * @param projectId Project identifier.
     * @returns Promise of a projects HTTP response.
     */
    getProjectActivities(companyId: string, projectId: string): Promise<any>;

    /**
     * Makes a write request to Rexor for persisting a time transactions.
     * @param timeTransaction Time transaction object.
     * @returns Promise of a saved Rexor time transaction HTTP response.
     */
    saveTimeTransaction(timeTransaction: TimeTransaction): Promise<any>;

    /**
     * Gets time codes from Rexor for a specified company.
     * @param companyId Id of the company in Rexor.
     * @returns Promise of time codes HTTP response.
     */
    getTimeCodes(companyId: string): Promise<any>;

    /**
     * Gets all persons(users) from Rexor.
     * @returns Promise of persons HTTP response.
     */
    getPersons(): Promise<any>

    /**
     * Gets a company from Rexor based on provided UID.
     * @param uid Unique identifier of company in Rexor.
     * @returns Promise of company HTTP response.
     */
    getCompany(uid: string): Promise<any>
}