import { HttpClientApi } from './http-client';
export const TempoHttpClientApi = "TempoHttpClient";

/**
 * HTTP Client interface for Tempo API.
 */
export interface TempoHttpClientApi extends HttpClientApi {

    /**
     * Requests Tempo worklogs for a givens set of filter parameters.
     * Filter parameters are optional. Though it is advisable to use them, since requests might take to long to process.
     * @param dataFrom Start date for the period.
     * @param dataTo End data for the period.
     * @param projectKey Key of a project in Jira.
     */
    getWorklogs(dateFrom: string, dateTo: string, projectKey?: string): Promise<any>
}