import { Service, Inject, Private } from 'tyx';
import { ConnectorApi, JiraConnectorApi } from '../../api/connector';
import { JiraHttpClientApi } from '../../api/http-client';
import { Environment } from '../../environment';
import * as superagent from 'superagent';

@Service(JiraHttpClientApi)
export class JiraHttpClientService implements JiraHttpClientApi {

    @Inject(JiraConnectorApi)
    private jiraConnectorService: JiraConnectorApi

    private projectUrl: string;
    private issueTypeUrl: string
    private usersUrl: string;
    private searchUrl: string;
    private issueUrl: string;

    constructor() {
        this.projectUrl = `${Environment.jiraApiUrl}/project`;
        this.issueTypeUrl = `${Environment.jiraApiUrl}/issuetype`;
        this.usersUrl = `${Environment.jiraApiUrl}/user/assignable/multiProjectSearch`;
        this.searchUrl = `${Environment.jiraApiUrl}/search`;
        this.issueUrl = `${Environment.jiraApiUrl}/issue`;
    }

    @Private()
    public async getProjects(): Promise<any> {
        let httpClient = await this.getHttpClient();
        let projectsResponse = await httpClient.get(this.projectUrl)
            .then((response) => {
                return response;
            }, (errorResponse) => {
                console.log("Error while retrieving Jira projects.", errorResponse);
                return errorResponse;
            });
        return projectsResponse;
    }


    @Private()
    public async getProject(id: string): Promise<any> {
        let httpClient = await this.getHttpClient();
        let projectResponse = await httpClient.get(`${this.projectUrl}/${id}`)
            .then((response) => {
                return response;
            }, (errorResponse) => {
                console.log("Error while retrieving Jira project.", errorResponse);
                return errorResponse;
            });
        return projectResponse;
    }

    @Private()
    public async getIssueType(id: string): Promise<any> {
        let httpClient = await this.getHttpClient();
        let issueTypesResponse = await httpClient.get(`${this.issueTypeUrl}/${id}`)
            .then(function (response) {
                return response;
            }, function (errorResponse) {
                console.log(`Error while retreiving Jira project issue types. Issue Type id: ${id}`, errorResponse);
                return errorResponse;
            });
        return issueTypesResponse;
    }

    @Private()
    public async getIssues(projectId: string, startAt?: number, maxResults?: number, fields?: string[]): Promise<any> {
        let httpClient = await this.getHttpClient();

        let requestBody = {};
        requestBody["jql"] = `project = ${projectId}`;
        requestBody["startAt"] = startAt || 0;
        requestBody["maxResults"] = maxResults || 100;
        requestBody["fields"] = fields || ["summary"]
        requestBody["fieldsByKeys"] = false;

        let issuesResponse = await httpClient.post(this.searchUrl)
            .send(requestBody)
            .then(function (response) {
                return response;
            }, function (errorResponse) {
                console.log(`Error while retreiving Jira project issues.`, errorResponse);
                return errorResponse;
            });
        return issuesResponse;
    }

    @Private()
    public async getIssue(idOrKey: string | number): Promise<any> {
        let httpClient = await this.getHttpClient();

        let issueResponse = await httpClient.get(`${this.issueUrl}/${idOrKey}`)
            .then(function (response) {
                return response;
            }, function (errorResponse) {
                console.log(`Error while retreiving Jira project issue.`, errorResponse);
                return errorResponse;
            });
        return issueResponse;
    }

    @Private()
    public async getUsers(projectKey: string): Promise<any> {
        let queryParams: string = `projectKeys=${projectKey}`;
        let httpClient = await this.getHttpClient();
        let usersResponse = await httpClient.get(this.usersUrl)
            .query(queryParams)
            .then((response) => {
                return response;
            }, (errorResponse) => {
                console.log("Error while retrieving users.", errorResponse);
                return errorResponse;
            });
        return usersResponse;
    }

    public async getHttpClient() {

        let defaultHeaders = {};
        defaultHeaders[this.getConnectorService().getAuthorizationPropertyName()] = await this.getConnectorService().getToken();
        defaultHeaders['Content-Type'] = 'application/json';

        return superagent.agent().set(defaultHeaders);
    }

    public getConnectorService(): ConnectorApi {
        return this.jiraConnectorService;
    }
}