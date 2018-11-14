import { AbsenceEntity } from '../../entity';

export const AbsenceApi = "Absence";

/**
 * Repository interface for absence table.
 */
export interface AbsenceApi {

    /**
      * Persists given entity into database.
      * If entity does not exist then it inserts, otherwise updates existing entity.
      * Upon save returned entity holds generated id.
      * @param entity AbsenceEntity. 
      * @returns Promise of a saved/updated AbsenceEntity.
      */
    save(entity: AbsenceEntity): Promise<AbsenceEntity>;

    /**
     * Deletes entity by a given conditions.
     * @param conditions Partial object of an AbsenceEntity.
     * @returns Promise of a void.
     */
    delete(conditions: Partial<AbsenceEntity>): Promise<void>;

    /**
      * Finds entity by given id.
      * @param id Id of the entity.
      * @returns Promise of an AbsenceEntity.
      */
    findOneById(id: number): Promise<AbsenceEntity>;

    /**
     * Finds entity that match the intersection of given column values. If more then one is found first one is returned.
     * At least one colum value must be defined.
     * Conditions are concatined by an 'AND' operator in the WHERE clause of the query.
     * @param id Id of the entity.
     * @returns Promise of an AbsenceEntity.
    */
    queryOneByColumn(columns: { id?: number, classificationId?: string, jiraProjectRexorProjectId?: number }): Promise<AbsenceEntity>;
}