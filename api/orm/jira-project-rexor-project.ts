import { FindOneOptions } from 'typeorm';
import { DeepPartialEntity, JiraProjectRexorProjectEntity } from '../../entity';

export const JiraProjectRexorProjectApi = "JiraProjectRexorProject";

/**
 * Repository interface for jira_project_rexor table.
 */
export interface JiraProjectRexorProjectApi {

    /**
     * Finds entities that match given conditions.
     * @param conditions Deep partial object of JiraProjectRexorProjectEntity. 
     * @returns Promise of an JiraProjectRexorProjectEntity array.
     */
    findWithConditions(conditions?: DeepPartialEntity<JiraProjectRexorProjectEntity>): Promise<JiraProjectRexorProjectEntity[]>;

    /**
     * Persists given entity into database.
     * If entity does not exist then it inserts, otherwise updates existing entity.
     * Upon save returned entity holds generated id.
     * @param entity JiraProjectRexorProjectEntity. 
     * @returns Promise of a saved/updated JiraProjectRexorProjectEntity.
     */
    save(entity: JiraProjectRexorProjectEntity): Promise<JiraProjectRexorProjectEntity>;

    /**
     * Deletes entity by a given conditions.
     * @param conditions Partial object of an JiraProjectRexorProjectEntity.
     * @returns Promise of a void.
     */
    delete(conditions: Partial<JiraProjectRexorProjectEntity>): Promise<void>;

    /**
    * Search for entity based on defined options. Return first one found.
    * @param options Options for search. 
    * @returns Promise of an JiraProjectRexorProjectEntity or undefined.
    */
    findOneWithOptions(options?: FindOneOptions<JiraProjectRexorProjectEntity>): Promise<JiraProjectRexorProjectEntity | undefined>;

    /**
     * Finds entity by given id.
     * @param id Id of the entity.
     * @param options Search options.
     * @returns Promise of an JiraProjectRexorProjectEntity.
     */
    findOneById(id: number, options?: FindOneOptions<JiraProjectRexorProjectEntity>): Promise<JiraProjectRexorProjectEntity>;

    /**
     * Retrieves all entities from the table.
     * @returns Promise of JiraProjectRexorProjectEntity array.
     */
    selectAll(): Promise<JiraProjectRexorProjectEntity[]>

    /**
     * Selects all entities where jira_project_id an entry in jiraProjectIds array.
     * @param jiraProjectIds Array of JIRA project ids.
     * @returns Promise of an JiraProjectRexorProjectEntity array.
     */
    selectByJiraProjectIds(jiraProjectIds: string[]): Promise<JiraProjectRexorProjectEntity[]>;
}