import { JiraProject } from '../../data/jira';
import { RexorProject } from '../../data/rexor';

export const ProjectMappingLoggerApi = "ProjectMappingLogger";

/**
 * Project mapping actions logger interface.
 */
export interface ProjectMappingLoggerApi {

    /**
     * Makes a new log entry in CloudWatch for a save Project mapping action.
     * Log holds the following information:
     * 1) Jira project list.
     * 2) Rexor project.
     * 3) User that executed the action.
     * 4) Date and time when the mapping was created.
     * @param jiraProjects Array of Jira projects that are in the mapping.
     * @param rexorProject Rexor project to which Jira projects are mapped.
     * @returns Promise of AWS Cloud Watch put log events response.
     */
    logSaveMappingsAction(jiraProjects: JiraProject[], rexorProject: RexorProject): Promise<any>;

    /**
     * Makes a new log entry in CloudWatch for a delete project mapping action.
     * Log holds the following information:
     * 1) Jira projecte.
     * 2) Rexor project.
     * 3) User that executed the action.
     * 4) Date and time when the mapping was deleted.
     * @param jiraProject Issue type in the mapping.
     * @param rexorProject Project activity to which the issue type was mapped.
     * @returns Promise of AWS Cloud Watch put log events response.
    */
    logDeleteMappingAction(jiraProject: JiraProject, rexorProject: RexorProject): Promise<any>;
}