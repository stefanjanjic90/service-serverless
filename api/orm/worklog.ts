import { FindOneOptions } from 'typeorm'
import { WorklogEntity } from '../../entity';

export const WorklogApi = "Worklog";

/**
 * Repository interface for worklog table.
 */
export interface WorklogApi {

    /**
     * Persists given entity into database.
     * If entity does not exist then it inserts, otherwise updates existing entity.
     * Upon save returned entity holds generated id.
     * @param entity WorklogEntity. 
     * @returns Promise of a saved/updated WorklogEntity.
     */
    save(entity: WorklogEntity): Promise<WorklogEntity>;

    /**
     * Persists given array of entities into database.
     * If entites do not exist then it inserts them, otherwise updates existing entites.
     * Upon save returned entites in array hold generated ids.
     * @param entities WorklogEntity array. 
     * @returns Promise of a saved/updated WorklogEntity array.
     */
    saveAll(entities: WorklogEntity[]): Promise<WorklogEntity[]>

    /**
     * Deletes entity by a given conditions.
     * @param conditions Partial object of an WorklogEntity.
     * @returns Promise of a void.
     */
    delete(conditions: Partial<WorklogEntity>): Promise<void>;

    /**
     * Finds entity by given id.
     * @param id Id of the entity.
     * @param options Search options.
     * @returns Promise of an WorklogEntity.
     */
    findOneById(id: string, options?: FindOneOptions<WorklogEntity>): Promise<WorklogEntity>;

}