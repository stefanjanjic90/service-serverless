import { JiraProjectRexorProjectEntity } from '../../entity';

export const ProjectMappingApi = "ProjectMapping";

/**
 * Interface defines methods for working with project mapping.
 */
export interface ProjectMappingApi {

    /**
     * Persists a given list of project mappings into database. 
     * Insertion of already existing mappings is skipped.
     * Logs the performed save action.
     * @param mappings Project mapping objects.
     * @returns Promise of a JiraProjectRexorProjectEntity array. Each entity in array holds the generated id of persisted mapping.
     */
    save(mappings: any): Promise<JiraProjectRexorProjectEntity[]>;

    /**
     * Deletes a project mapping from database based on a provided id.
     * Logs the performed delete action.
     * @param id Id of the project mapping.
     * @returns Promise of a JiraProjectRexorProjectEntity removed from database.
     */
    delete(id: number): Promise<JiraProjectRexorProjectEntity>;

    /**
     * Retrieves all project mappings from database.
     * @returns Promise of a JiraProjectRexorProjectEntity array.
     */
    getAll(): Promise<JiraProjectRexorProjectEntity[]>;

    /**
     * Retrieves a project mapping from database based on a provided id.
     * @param id Id of the project mapping.
     * @returns Promise of a JiraProjectRexorProjectEntity.
     */
    get(id: number): Promise<JiraProjectRexorProjectEntity>;
}