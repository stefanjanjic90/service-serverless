import { RexorProject, ProjectActivity, TimeCode } from '../../data/rexor';

export const RexorProjectApi = "RexorProject";

/**
 * Interfaces provides methods for working with Rexor projects and it's related objects.
 */
export interface RexorProjectApi {

    /**
     * Requests all Rexor projects. 
     * Transforms the HTTP response into array of RexorProjects objects.
     * Method is triggered on HTTP GET event for /rexor-project path.
     * @returns Promise of RexorProject array.
     */
    getAllProjects(): Promise<RexorProject[]>;

    /**
     * Requests a single Rexor project based on a provided UID. 
     * Transforms the HTTP response into array of RexorProjects objects.
     * Method is triggered on HTTP GET event for /rexor-project/{uid} path.
     * @param uid Unique identifier of a Rexor project.
     * @returns Promise of RexorProject.
     */
    getProject(uid: string): Promise<RexorProject>;

    /**
     * Requests all activities on a Rexor project based on a provided project UID. 
     * Transforms the HTTP response into array of ProjectActivity objects.
     * Makes an additional request for a Rexor project. 
     * Additional parameters (companyId, projectId) are needed from a RexorProject object to make a request for activities.
     * Method is triggered on HTTP GET event for /rexor-project/{uid}/activity path.
     * @param projectUid Unique identifier of a Rexor project.
     * @returns Promise of a ProjectActivity array.
     */
    getProjectActivities(projectUid: string): Promise<ProjectActivity[]>;

    /**
     * Requests all activities on a Rexor project based on a provided comapny id and project id. 
     * The project must belong to the provided company.
     * Transforms the HTTP response into array of ProjectActivity objects.
     * @param companyId Id of a company in Rexor.
     * @param projectId Id of a Rexor project.
     * @returns Promise of a ProjectActivity array.
     */
    getCompanyProjectActivities(companyId: string, projectId: string): Promise<ProjectActivity[]>;

    /**
     * Requests a single project activity from Rexor based on a provided activity uid.
     * Transforms the HTTP response into array of ProjectActivity objects.
     * @param uid Unique identifier of a project activity.
     * @returns Promise of a ProjectActivity.
     */
    getProjectActivity(uid: string): Promise<ProjectActivity>;

    /**
     * Requests an array of time code for a company specified on a project.
     * Transforms HTTP respons into array of TimeCode objects.
     * @param projectUid Unique identifier of a project.
     * @returns Promise of a TimeCode array.
     */
    getTimeCodes(projectUid: string): Promise<TimeCode[]>
}