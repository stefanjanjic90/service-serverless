import { Service, Public, Get, Inject, PathParam, Internal } from 'tyx';
import { RexorProject, ProjectActivity, TimeCode } from '../../../data/rexor';
import { RexorProjectApi } from '../../../api/project';
import { RexorHttpClientApi } from '../../../api/http-client';
import { InternalErrorException } from '../../../exception';

@Service(RexorProjectApi)
export class RexorProjectService implements RexorProjectApi {

    @Inject(RexorHttpClientApi)
    private rexorHttpClient: RexorHttpClientApi;

    @Public()
    @Get("/rexor-project")
    public async getAllProjects(): Promise<RexorProject[]> {
        try {
            let projectsResponse = await this.rexorHttpClient.getProjects();
            let rexorProjectDataArray = projectsResponse.body;
            let rexorProjects: RexorProject[] = [];
            for (let rexorProjectData of rexorProjectDataArray) {
                let rexorProject: RexorProject = {
                    uid: rexorProjectData.UID,
                    id: rexorProjectData.ID,
                    description: rexorProjectData.Description,
                    status: rexorProjectData.Status,
                    companyId: rexorProjectData.Company
                };
                rexorProjects.push(rexorProject);
            }

            return rexorProjects;
        } catch (exception) {
            console.log('Error while retrieving all Rexor projects.', exception);
            let internalErrorException = new InternalErrorException(exception);
            throw internalErrorException.convertToTyxException();
        }
    }

    @Public()
    @Get("/rexor-project/{uid}")
    public async getProject( @PathParam("uid") uid: string): Promise<RexorProject> {
        try {
            let projectResponse = await this.rexorHttpClient.getProject(uid);
            let rexorProjectData = projectResponse.body;
            let rexorProject: RexorProject = {
                uid: rexorProjectData.UID,
                id: rexorProjectData.ID,
                description: rexorProjectData.Description,
                status: rexorProjectData.Status,
                companyId: rexorProjectData.Company
            };
            return rexorProject;
        } catch (exception) {
            console.log('Error while retrieving Rexor project.', exception);
            let internalErrorException = new InternalErrorException(exception);
            throw internalErrorException.convertToTyxException();
        }
    }

    @Public()
    @Get("/rexor-project/{uid}/activity")
    public async getProjectActivities( @PathParam("uid") projectUid: string): Promise<ProjectActivity[]> {
        try {
            let rexorProject = await this.getProject(projectUid);
            let projectActivities: ProjectActivity[] = await this.getCompanyProjectActivities(rexorProject.companyId, rexorProject.id);
            return projectActivities;
        } catch (exception) {
            console.log('Error while retrieving Rexor project activites.', exception);
            let internalErrorException = new InternalErrorException(exception);
            throw internalErrorException.convertToTyxException();
        }
    }

    @Internal()
    public async getCompanyProjectActivities(companyId: string, projectId: string): Promise<ProjectActivity[]> {
        try {
            let projectActivitiesResponse = await this.rexorHttpClient.getProjectActivities(companyId, projectId);
            let projectActivityDataArray = projectActivitiesResponse.body;
            let projectActivities: ProjectActivity[] = [];

            for (let projectActivityData of projectActivityDataArray) {
                let projectActivity: ProjectActivity = { uid: projectActivityData.UID, id: projectActivityData.ID, description: projectActivityData.Description };
                projectActivities.push(projectActivity);
            }
            return projectActivities;

        } catch (exception) {
            console.log('Error while retrieving Rexor project activites for company.', exception);
            let internalErrorException = new InternalErrorException(exception);
            throw internalErrorException.convertToTyxException();
        }
    }

    @Internal()
    public async getProjectActivity(uid: string): Promise<ProjectActivity> {
        try {
            let projectActivityResponse = await this.rexorHttpClient.getProjectActivity(uid);
            let projectActivityData = projectActivityResponse.body;
            let projectActivity: ProjectActivity = { uid: projectActivityData.UID, id: projectActivityData.ID, description: projectActivityData.Description };
            return projectActivity;
        } catch (exception) {
            console.log('Error while retrieving Rexor project activity.', exception);
            let internalErrorException = new InternalErrorException(exception);
            throw internalErrorException.convertToTyxException();
        }
    }

    @Public()
    @Get("/rexor-project/{uid}/time-code")
    public async getTimeCodes( @PathParam("uid") projectUid: string): Promise<TimeCode[]> {
        try {
            let rexorProject = await this.getProject(projectUid);
            let timeCodesResponse = await this.rexorHttpClient.getTimeCodes(rexorProject.companyId);
            let timeCodeDataArray = timeCodesResponse.body;

            let timeCodeArray: TimeCode[] = [];
            for (let timeCodeData of timeCodeDataArray) {
                let timeCode = { id: timeCodeData.ID, uid: timeCodeData.UID, timeType: timeCodeData.TimeType, description: timeCodeData.Description };
                timeCodeArray.push(timeCode);
            }
            return timeCodeArray;
        } catch (exception) {
            console.log('Error while retrieving Rexor time codes.', exception);
            let internalErrorException = new InternalErrorException(exception);
            throw internalErrorException.convertToTyxException();
        }
    }
}