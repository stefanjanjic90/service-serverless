import { IssueTimeCodeEntity } from '../../entity';

export const IssueTimeCodeApi = "IssueTimeCode";

/**
 * Repository interface for issue_time_code table.
 */
export interface IssueTimeCodeApi {

    /**
     * Persists given entity into database.
     * If entity does not exist then it inserts, otherwise updates existing entity.
     * Upon save returned entity holds generated id.
     * @param entity IssueTimeCodeEntity. 
     * @returns Promise of a saved/updated IssueTimeCodeEntity.
     */
    save(entity: IssueTimeCodeEntity): Promise<IssueTimeCodeEntity>;

    /**
     * Deletes entity by a given conditions.
     * @param conditions Partial object of an IssueTimeCodeEntity.
     * @returns Promise of a void.
     */
    delete(conditions: Partial<IssueTimeCodeEntity>): Promise<void>;

    /**
      * Finds entity by given id.
     * @param id Id of the entity.
      * @returns Promise of an IssueTimeCodeEntity.
      */
    findOneById(id: number): Promise<IssueTimeCodeEntity>;

    /**
     * Finds entities that match the intersection of given column values.
     * At least one colum value must be defined.
     * Conditions are concatined by an 'AND' operator in the WHERE clause of the query.
     * @param id Id of the entity.
     * @returns Promise of an IssueTimeCodeEntity array.
     */
    queryByColumn(columns: { id?: number, issueId?: string, timeCodeUid?: string, absenceId?: number }): Promise<IssueTimeCodeEntity[]>;
}