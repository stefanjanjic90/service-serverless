import { HttpClientApi } from './http-client';
export const JiraHttpClientApi = "JiraHttpClient";

/**
 * HTTP Client interface for JIRA API.
 */
export interface JiraHttpClientApi extends HttpClientApi {

    /**
     * Requests all projects from Jira.
     * @returns Promise of a Jira projects HTTP response.
     */
    getProjects(): Promise<any>;

    /**
     * Requests a specific JIRA project based on provided project id.
     * @param id Id of a project in JIRA.
     * @returns Promise of Jira project HTTP response.
     */
    getProject(id: string): Promise<any>;

    /**
     * Requests a specific JIRA issue type based on provided issue type id.
     * @param id Id of an issue type in JIRA.
     * @returns Promise of Jira issue type HTTP response.
     */
    getIssueType(id: string): Promise<any>;

    /**
     * Requests a list of issues on a project.
     * @param projectId Key value for a JIRA project.
     * @param startAt Pagination parameter, starting from which issue to return the result. Defaults to 0.
     * @param maxResult Pagination parameter, maximum number of issues to return in response. Defaults to 100. Maximum 100.
     * @param fields  Which additional issue fields to return in the result. Defaults to: [summary].
     * @returns Promise of JIRA issue search HTTP response.
     */
    getIssues(projectId: string, startAt?: number, maxResults?: number, fields?: string[]): Promise<any>;

    /**
     * Retrieves specific issue from JIRA based on the provided id or key.
     * @param idOrKey id or a key of JIRA issue.
     * @returns Promise of JIRA issue HTTP response.
     */
    getIssue(idOrKey: string | number): Promise<any>

    /**
     * Requests a list of all users on a project.
     * @param projectKey Key value for a JIRA project.
     * @returns Promise of a JIRA users on a project HTTP response.
     */
    getUsers(projectKey: string): Promise<any>;
}