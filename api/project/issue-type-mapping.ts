import { IssueTypeProjectActivityEntity } from '../../entity';

export const IssueTypeMappingApi = "IssueTypeMapping";

/**
 * Interface defines methods for working with issue type mapping.
 */
export interface IssueTypeMappingApi {

    /**
     * Persists a given list of issue type mappings into database. 
     * Insertion of already existing mappings is skipped.
     * Logs the performed save action.
     * @param mappings Issue type mapping objects.
     * @returns Promise of a IssueTypeProjectActivityEntity array. Each entity in array holds the generated id of persisted mapping.
     */
    save(mappings: any): Promise<IssueTypeProjectActivityEntity[]>;

    /**
     * Deletes a issue type mapping from database based on a provided id.
     * Logs the performed delete action.
     * @param id Id of the issue type mapping.
     * @returns Promise of a IssueTypeProjectActivityEntity removed from database.
     */
    delete(id: any): Promise<IssueTypeProjectActivityEntity>;

    /**
     * Retrieves a issue type mapping from database based on a provided project mapping (jiraProjectRexorProjectEntity) id.
     * @param id Id of the project mapping.
     * @returns Promise of a IssueTypeProjectActivityEntity.
     */
    get(jiraProjectRexorProjectId: number): Promise<IssueTypeProjectActivityEntity[]>;
}