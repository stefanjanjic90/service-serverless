import { FindOneOptions } from 'typeorm';
import { IssueTypeProjectActivityEntity } from '../../entity';

export const IssueTypeProjectActivityApi = "IssueTypeProjectActivity";

/**
 * Repository interface for issue_type_project_activity table.
 */
export interface IssueTypeProjectActivityApi {

    /**
     * Persists given entity into database.
     * If entity does not exist then it inserts, otherwise updates existing entity.
     * Upon save returned entity holds generated id.
     * @param entity IssueTypeProjectActivityEntity. 
     * @returns Promise of a saved/updated IssueTypeProjectActivityEntity.
     */
    save(entity: IssueTypeProjectActivityEntity): Promise<IssueTypeProjectActivityEntity>;

    /**
     * Deletes entity by a given conditions.
     * @param conditions Partial object of an IssueTypeProjectActivityEntity.
     * @returns Promise of a void.
     */
    delete(conditions: Partial<IssueTypeProjectActivityEntity>): Promise<void>;

    /**
     * Finds entity by given id.
     * @param id Id of the entity.
     * @param options Search options.
     * @returns Promise of an IssueTypeProjectActivityEntity.
     */
    findOneById(id: number, options?: FindOneOptions<IssueTypeProjectActivityEntity>): Promise<IssueTypeProjectActivityEntity>;


    /**
     * Finds entities that match the intersection of given column values.
     * At least one colum value must be defined.
     * Conditions are concatined by an 'AND' operator in the WHERE clause of the query.
     * @param columns Column values to query on. At least one column value must be specified.
     * @returns Promise of an IssueTypeProjectActivityEntity array.
     */
    queryByColumn(columns: { id?: number, issueTypeId?: string, projectActivityUid?: string, jiraProjectRexorProjectId?: number }): Promise<IssueTypeProjectActivityEntity[]>;
}