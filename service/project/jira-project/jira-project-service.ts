import { Service, Public, Get, Inject, PathParam, Internal } from 'tyx';
import { JiraProject, IssueType, JiraUser, Issue } from "../../../data/jira";
import { JiraProjectApi } from '../../../api/project';
import { JiraHttpClientApi } from '../../../api/http-client';
import { InternalErrorException } from '../../../exception';

@Service(JiraProjectApi)
export class JiraProjectService implements JiraProjectApi {

    @Inject(JiraHttpClientApi)
    private jiraHttpClient: JiraHttpClientApi;

    @Public()
    @Get("/jira-project")
    public async getAllProjects(): Promise<JiraProject[]> {
        try {
            let projectsResponse = await this.jiraHttpClient.getProjects();
            let jiraProjectDataArray = projectsResponse.body;
            let jiraProjects: JiraProject[] = [];

            for (let jiraProjectData of jiraProjectDataArray) {
                let jiraProject: JiraProject = { id: jiraProjectData.id, key: jiraProjectData.key, name: jiraProjectData.name };
                jiraProjects.push(jiraProject);
            }
            return jiraProjects;
        } catch (exception) {
            console.log("Error while retrieving all Jira projects.");
            let internalErrorException = new InternalErrorException(exception);
            throw internalErrorException.convertToTyxException();
        }
    }

    @Internal()
    public async getProjects(ids: string[]): Promise<JiraProject[]> {
        try {
            let jiraProjects: JiraProject[] = [];
            for (let id of ids) {
                let jiraProject = await this.getProject(id);
                jiraProjects.push(jiraProject);
            }

            return jiraProjects;
        } catch (exception) {
            console.log("Error while retrieving Jira projects.", exception);
            let internalErrorException = new InternalErrorException(exception);
            throw internalErrorException.convertToTyxException();
        }
    }

    @Public()
    @Get("/jira-project/{id}")
    public async getProject( @PathParam("id") id: string): Promise<JiraProject> {
        try {
            let projectResponse = await this.jiraHttpClient.getProject(id);
            let jiraProjectData = projectResponse.body;
            let jiraProject: JiraProject = { id: jiraProjectData.id, key: jiraProjectData.key, name: jiraProjectData.name };

            return jiraProject;
        } catch (exception) {
            console.log("Error while retrieving Jira project.", exception);
            let internalErrorException = new InternalErrorException(exception);
            throw internalErrorException.convertToTyxException();
        }
    }

    @Public()
    @Get("/jira-project/{id}/issue-type")
    public async getProjectIssueTypes( @PathParam("id") projectId: string): Promise<IssueType[]> {
        try {
            let projectResponse = await this.jiraHttpClient.getProject(projectId);
            let issueTypeDataArray = projectResponse.body.issueTypes;
            let issueTypes: IssueType[] = [];

            for (let issueTypeData of issueTypeDataArray) {
                let issueType: IssueType = { id: issueTypeData.id, name: issueTypeData.name, description: issueTypeData.description };
                issueTypes.push(issueType);
            }

            return issueTypes;
        } catch (exception) {
            console.log("Error while retrieving issue types.", exception);
            let internalErrorException = new InternalErrorException(exception);
            throw internalErrorException.convertToTyxException();
        }
    }

    @Internal()
    public async getIssueTypes(ids: string[]): Promise<IssueType[]> {
        try {
            let issueTypes: IssueType[] = [];
            for (let id of ids) {
                let issueType = await this.getIssueType(id);
                issueTypes.push(issueType);
            }
            return issueTypes;
        } catch (exception) {
            console.log("Error while retrieving issue types", exception);
            let internalErrorException = new InternalErrorException(exception);
            throw internalErrorException.convertToTyxException();
        }
    }

    @Internal()
    public async getIssueType(id: string): Promise<IssueType> {
        try {
            let issueTypesResponse = await this.jiraHttpClient.getIssueType(id);
            let issueTypeData = issueTypesResponse.body;
            let issueType: IssueType = { id: issueTypeData.id, name: issueTypeData.name, description: issueTypeData.description, };
            return issueType;
        } catch (exception) {
            console.log("Error while retrieving issue types", exception);
            let internalErrorException = new InternalErrorException(exception);
            throw internalErrorException.convertToTyxException();
        }
    }

    @Public()
    @Get("/jira-project/{id}/issue")
    public async getIssues( @PathParam("id") projectId: string): Promise<Issue[]> {
        try {
            let issuesResponse = await this.jiraHttpClient.getIssues(projectId);
            let issueDataArray = issuesResponse.body.issues;

            let issueArray: Issue[] = [];
            for (let issueData of issueDataArray) {
                let issue: Issue = { id: issueData.id, key: issueData.key, summary: issueData.fields.summary };
                issueArray.push(issue);
            }
            return issueArray;
        } catch (exception) {
            console.log("Error while retrieving issues.", exception);
            let internalErrorException = new InternalErrorException(exception);
            throw internalErrorException.convertToTyxException();
        }
    }

    @Internal()
    public async getIssue(idOrKey: string | string): Promise<Issue> {
        try {
            let issuesResponse = await this.jiraHttpClient.getIssue(idOrKey);
            let issue: Issue = { id: issuesResponse.body.id, key: issuesResponse.body.key, summary: issuesResponse.body.fields.summary };
            return issue;
        } catch (exception) {
            console.log("Error while retrieving issue.", exception);
            let internalErrorException = new InternalErrorException(exception);
            throw internalErrorException.convertToTyxException();
        }
    }

    @Public()
    @Get("/jira-user/{projectKey}")
    public async getUsers( @PathParam("projectKey") projectKey: string): Promise<JiraUser[]> {
        try {
            let usersResponse = await this.jiraHttpClient.getUsers(projectKey);
            let userDataArray = JSON.parse(usersResponse.text);

            let jiraUsers: JiraUser[] = [];
            for (let userData of userDataArray) {
                if (!userData.key.includes("addon")) {
                    let jiraUser: JiraUser = { key: userData.key };
                    jiraUsers.push(jiraUser);
                }
            }
            return jiraUsers;
        } catch (exception) {
            console.log("Error while retrieving users", exception);
            let internalErrorException = new InternalErrorException(exception);
            throw internalErrorException.convertToTyxException();
        }
    }
}