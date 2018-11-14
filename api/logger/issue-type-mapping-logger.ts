import { IssueType } from '../../data/jira';
import { ProjectActivity } from '../../data/rexor';

export const IssueTypeMappingLoggerApi = "IssueTypeMappingLogger";

/**
 * Issue type mapping actions logger interface.
 */
export interface IssueTypeMappingLoggerApi {
    /**
     * Makes a new log entry in CloudWatch for a save issue type mapping action.
     * Log holds the following information:
     * 1) Issue type list.
     * 2) Project activity.
     * 3) User that executed the action.
     * 4) Date and time when the mapping was created.
     * @param issueTypes Array of issue types that are in the mapping.
     * @param projctActivity Project activity to which issue types are mapped.
     * @returns Promise of AWS Cloud Watch put log events response.
     */
    logSaveMappingAction(issueTypes: IssueType[], projectActivity: ProjectActivity): Promise<any>;

    /**
     * Makes a new log entry in CloudWatch for a delete issue type mapping action.
     * Log holds the following information:
     * 1) Issue type.
     * 2) Project activity.
     * 3) User that executed the action.
     * 4) Date and time when the mapping was deleted.
     * @param issueType Issue type in the mapping.
     * @param projctActivity Project activity to which the issue type was mapped.
     * @returns Promise of AWS Cloud Watch put log events response.
     */
    logDeleteMappingAction(issueType: IssueType, projectActivity: ProjectActivity): Promise<any>;
}