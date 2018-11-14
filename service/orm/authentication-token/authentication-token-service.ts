import { Service, Inject, Internal } from "tyx";
import { FindOneOptions } from 'typeorm';
import { DatabaseManagerApi, AuthenticationTokenApi } from '../../../api/orm';
import { AuthenticationTokenEntity } from "../../../entity";

@Service(AuthenticationTokenApi)
export class AuthenticationTokenService implements AuthenticationTokenApi {

    @Inject(DatabaseManagerApi)
    protected databaseManager: DatabaseManagerApi;

    @Internal()
    public async findOneWithOptions(options?: FindOneOptions<AuthenticationTokenEntity>): Promise<AuthenticationTokenEntity | undefined> {
        return this.databaseManager.AuthenticationTokenRepository.findOne(options);
    }

    @Internal()
    public async save(entity: AuthenticationTokenEntity): Promise<AuthenticationTokenEntity> {
        return this.databaseManager.AuthenticationTokenRepository.save(entity);
    }

    @Internal()
    public async delete(conditions: Partial<AuthenticationTokenEntity>): Promise<void> {
        return this.databaseManager.AuthenticationTokenRepository.delete(conditions);
    }
}
