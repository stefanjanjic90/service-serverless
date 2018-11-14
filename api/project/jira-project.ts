import { JiraProject, IssueType, JiraUser, Issue } from '../../data/jira';

export const JiraProjectApi = 'JiraProject';

/**
 * Interfaces provides methods for working with JIRA projects and it's related objects.
 */
export interface JiraProjectApi {

    /**
     * Requests all JIRA projects. 
     * Transforms the HTTP response into array of JiraProject objects.
     * Method is triggered on HTTP GET event for /jira-project path.
     * @returns A promise of a JiraProject array.
     */
    getAllProjects(): Promise<JiraProject[]>;

    /**
     * Requests JIRA projects based on provided array of ids. 
     * Transforms the HTTP response into array of JiraProject objects.
     * Makes a HTTP request to JIRA API for each id in the array.
     * The API does not provide an endpoint for a bulk request for specific ids.
     * @param ids Array of JIRA project ids.
     * @returns Promise of a JiraProject array.
     */
    getProjects(ids: string[]): Promise<JiraProject[]>;

    /**
     * Requests a single JIRA project based on a provided id. 
     * Transforms the HTTP response into JiraProject object.
     * Method is triggered on HTTP GET event for /jira-project/{id} path.
     * @param idOrKey Id or a key of a project in JIRA.
     * @returns Promise of a JiraProject.
     */
    getProject(idOrKey: string): Promise<JiraProject>;

    /**
     * Requests all issue types on a JIRA project based on a provided project id. 
     * Transforms the HTTP response into an array of IssueType objects.
     * Method is triggered on HTTP GET event for /project/{id}/issue-type path.
     * @param projectId Id of a JIRA project.
     * @returns Promise of an IssueType array.
     */
    getProjectIssueTypes(projectId: string): Promise<IssueType[]>;

    /**
     * Requests JIRA issue types based on provided array of ids. 
     * Transforms the HTTP response into array of IssueType objects.
     * Makes a HTTP request to JIRA API for each id in the array. 
     * The API does not provide an endpoint for a bulk request for specific ids.
     * @param ids Array of JIRA issue type ids.
     * @returns Promise of an IssueType array.
     */
    getIssueTypes(ids: string[]): Promise<IssueType[]>;

    /**
     * Requests a single JIRA issue type based on a provided id. 
     * Transforms the HTTP response into IssueType object.
     * @param idOrKey Id of an issue type in JIRA.
     * @returns Promise of an IssueType.
     */
    getIssueType(id: string): Promise<IssueType>;

    /**
     * Requests an array of Issues for a given project.
     * @param id Id of project in JIRA.
     * @returns Promise of  anIssue array.
     */
    getIssues(projectId: string): Promise<Issue[]>

    /**
     * Requests an array of Issue basedon specifed JIRA issue id or key.
     * @param idOrKey Id or Key of project in JIRA.
     * @returns Promise of  an Issue.
     */
    getIssue(idOrKey: string | string): Promise<Issue>

    /**
     * Requests a list of all users on a JIRA project. 
     * Transforms the HTTP response into array of JiraUser objects.
     * Filters all the system(addon) generated users.
     * Method is triggered on HTTP GET event for /jira-user/{projectKey} path.
     * @param projectKey Key of a project in JIRA.
     * @returns Promise of a JiraUser array.
     */
    getUsers(projectKey: string): Promise<JiraUser[]>;
}