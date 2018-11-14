import { FindManyOptions, FindOneOptions } from 'typeorm'
import { WorklogTransferEntity } from '../../entity';

export const WorklogTransferApi = "WorklogTransfer";

/**
 * Repository interface for worklog_transfer table.
 */
export interface WorklogTransferApi {

    /**
     * Counts entities that match given conditions.
     * @param options Options for search. 
     * @returns Promise of number of entities.
    */
    countWithOptions(options?: FindManyOptions<WorklogTransferEntity>): Promise<number>;

    /**
     * Finds entities that match given options.
     * @param options Options for search. 
     * @returns Promise of an WorklogTransferEntity array.
    */
    findWithOptions(options?: FindManyOptions<WorklogTransferEntity>): Promise<WorklogTransferEntity[]>;

    /**
     * Persists given entity into database.
     * If entity does not exist then it inserts, otherwise updates existing entity.
     * Upon save returned entity holds generated id.
     * @param entity WorklogTransferEntity. 
     * @returns Promise of a saved/updated WorklogTransferEntity.
     */
    save(entity: WorklogTransferEntity): Promise<WorklogTransferEntity>;

    /**
     * Persists given array of entities into database.
     * If entites do not exist then it inserts them, otherwise updates existing entites.
     * Upon save returned entites in array hold generated ids.
     * @param entities WorklogTransferEntity array. 
     * @returns Promise of a saved/updated WorklogTransferEntity array.
     */
    saveAll(entities: WorklogTransferEntity[]): Promise<WorklogTransferEntity[]>

    /**
     * Deletes entity by a given conditions.
     * @param conditions Partial object of an WorklogTransferEntity.
     * @returns Promise of a void.
     */
    delete(conditions: Partial<WorklogTransferEntity>): Promise<void>;

    /**
     * Search for entity based on defined options. Return first one found.
     * @param options Options for search. 
     * @returns Promise of an WorklogTransferEntity or undefined.
     */
    findOneWithOptions(options?: FindOneOptions<WorklogTransferEntity>): Promise<WorklogTransferEntity | undefined>;

    /**
     * Finds entity by given id.
     * @param id Id of the entity.
     * @param options Search options.
     * @returns Promise of an WorklogTransferEntity.
     */
    findOneById(id: number, options?: FindOneOptions<WorklogTransferEntity>): Promise<WorklogTransferEntity>;

    /**
     * Finds entity that match the intersection of given column values. If more then one is found first one is returned.
     * At least one colum value must be defined.
     * Conditions are concatined by an 'AND' operator in the WHERE clause of the query.
     * @param id Id of the entity.
     * @returns Promise of an WorklogTransferEntity.
     */
    queryOneByColumn(columns: { id?: number, worklogId?: string, createdBy?: string, transferStatusCd?: string }): Promise<WorklogTransferEntity>

    /**
     * Selects all entities where worklog_id matches an entry in worklogIds array.
     * @param worklogIds Array of Tempo worklog ids.
     * @returns Promise of an WorklogTransferEntity array.
     */
    selectByWorklogIds(worklogIds: string[]): Promise<WorklogTransferEntity[]>;

    /**
     * Selects an entity vased on worklog id.
     * @param worklogIds Tempo worklog id.
     * @returns Promise of an WorklogTransferEntity.
     */
    selectByWorklogId(worklogId: string): Promise<WorklogTransferEntity>;
}