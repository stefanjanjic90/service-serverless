import { Proxy, LambdaProxy } from 'tyx';
import { ApplicationContainer } from '../../../application-container';
import { RexorProject, ProjectActivity, TimeCode } from '../../../data/rexor';
import { RexorProjectApi } from '../../../api/project';

@Proxy(RexorProjectApi, ApplicationContainer.ApplicationName, RexorProjectApi)
export class RexorProjectProxy extends LambdaProxy implements RexorProjectApi {

    public async getAllProjects(): Promise<RexorProject[]> {
        return this.proxy(this.getAllProjects, arguments);
    }

    public async getProject(uid: string): Promise<RexorProject> {
        return this.proxy(this.getProject, arguments);
    }

    public async getProjectActivities(projectUid: string): Promise<ProjectActivity[]> {
        return this.proxy(this.getProjectActivities, arguments);
    }

    public async getCompanyProjectActivities(companyId: string, projectId: string): Promise<ProjectActivity[]> {
        return this.proxy(this.getCompanyProjectActivities, arguments);
    }

    public async getProjectActivity(uid: string): Promise<ProjectActivity> {
        return this.proxy(this.getProjectActivity, arguments);
    }

    public async getTimeCodes(projectUid: string): Promise<TimeCode[]> {
        return this.proxy(this.getTimeCodes, arguments);
    }
}