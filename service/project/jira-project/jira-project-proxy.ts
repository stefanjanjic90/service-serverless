import { Proxy, LambdaProxy } from 'tyx';
import { ApplicationContainer } from '../../../application-container';
import { JiraProject, IssueType, JiraUser, Issue } from "../../../data/jira";
import { JiraProjectApi } from '../../../api/project';

@Proxy(JiraProjectApi, ApplicationContainer.ApplicationName, JiraProjectApi)
export class JiraProjectProxy extends LambdaProxy implements JiraProjectApi {

    public async getAllProjects(): Promise<JiraProject[]> {
        return this.proxy(this.getAllProjects, arguments);
    }

    public async getProjects(ids: string[]): Promise<JiraProject[]> {
        return this.proxy(this.getProjects, arguments);
    }

    public async getProject(idOrKey: string): Promise<JiraProject> {
        return this.proxy(this.getProject, arguments);
    }

    public async getProjectIssueTypes(projectId: string): Promise<IssueType[]> {
        return this.proxy(this.getProjectIssueTypes, arguments);
    }

    public async getIssueTypes(ids: string[]): Promise<IssueType[]> {
        return this.proxy(this.getIssueTypes, arguments);
    }

    public async getIssueType(id: string): Promise<IssueType> {
        return this.proxy(this.getIssueType, arguments);
    }

    public async getIssues(projectId: string): Promise<Issue[]> {
        return this.proxy(this.getIssues, arguments);
    }

    public async getIssue(idOrKey: string | number): Promise<Issue> {
        return this.proxy(this.getIssue, arguments);
    }

    public async getUsers(projectKey: string): Promise<JiraUser[]> {
        return this.proxy(this.getUsers, arguments);
    }
}