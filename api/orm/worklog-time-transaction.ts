import { FindOneOptions } from 'typeorm';
import { WorklogTimeTransactionEntity } from '../../entity';

export const WorklogTimeTransactionApi = "WorklogTimeTransaction";

/**
 * Repository interface for worklog_time_transaction table.
 */
export interface WorklogTimeTransactionApi {

    /**
     * Persists given entity into database.
     * If entity does not exist then it inserts, otherwise updates existing entity.
     * Upon save returned entity holds generated id.
     * @param entity WorklogTimeTransactionEntity. 
     * @returns Promise of a saved/updated WorklogTimeTransactionEntity.
     */
    save(entity: WorklogTimeTransactionEntity): Promise<WorklogTimeTransactionEntity>;

    /**
     * Persists given array of entities into database.
     * If entites do not exist then it inserts them, otherwise updates existing entites.
     * Upon save returned entites in array hold generated ids.
     * @param entities WorklogTimeTransactionEntity array. 
     * @returns Promise of a saved/updated WorklogTimeTransactionEntity array.
     */
    saveAll(entities: WorklogTimeTransactionEntity[]): Promise<WorklogTimeTransactionEntity[]>

    /**
     * Deletes entity by a given conditions.
     * @param conditions Partial object of an WorklogTimeTransactionEntity.
     * @returns Promise of a void.
     */
    delete(conditions: Partial<WorklogTimeTransactionEntity>): Promise<void>;

    /**
     * Finds entity by given id.
     * @param id Id of the entity.
     * @param options Search options.
     * @returns Promise of an WorklogTimeTransactionEntity.
     */
    findOneById(id: number, options?: FindOneOptions<WorklogTimeTransactionEntity>): Promise<WorklogTimeTransactionEntity>;

    /**
     * Selects all entities where worklog_id matches an entry in worklogIds array.
     * @param worklogIds Array of Tempo worklog ids.
     * @returns Promise of an WorklogTimeTransactionEntity array.
     */
    selectByWorklogIds(worklogIds: string[]): Promise<WorklogTimeTransactionEntity[]>;
}