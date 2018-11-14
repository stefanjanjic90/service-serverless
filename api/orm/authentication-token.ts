import { FindOneOptions } from 'typeorm';
import { AuthenticationTokenEntity } from '../../entity';

export const AuthenticationTokenApi = "AuthenticationToken";

/**
 * Repository interface for authentication_tokem table.
 */
export interface AuthenticationTokenApi {

    /**
     * Search for entity based on defined options. Return first one found.
     * @param options Options for search. 
     * @returns Promise of an AuthenticationTokenEntity or undefined.
     */
    findOneWithOptions(options?: FindOneOptions<AuthenticationTokenEntity>): Promise<AuthenticationTokenEntity | undefined>;

    /**
     * Persists given entity into database.
     * If entity does not exist then it inserts, otherwise updates existing entity.
     * Upon save returned entity holds generated id.
     * @param entity AuthenticationTokenEntity. 
     * @returns Promise of a saved/updated AuthenticationTokenEntity.
     */
    save(entity: AuthenticationTokenEntity): Promise<AuthenticationTokenEntity>;

    /**
     * Deletes entity by a given conditions.
     * @param conditions Partial object of an AuthenticationTokenEntity.
     * @returns Promise of a void.
     */
    delete(conditions: Partial<AuthenticationTokenEntity>): Promise<void>;


}