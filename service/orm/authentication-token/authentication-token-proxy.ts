import { Proxy, LambdaProxy } from "tyx";
import { FindOneOptions } from 'typeorm';
import { ApplicationContainer } from '../../../application-container';
import { AuthenticationTokenApi } from "../../../api/orm";
import { AuthenticationTokenEntity } from '../../../entity';

@Proxy(AuthenticationTokenApi, ApplicationContainer.ApplicationName, AuthenticationTokenApi)
export class AuthenticationTokenProxy extends LambdaProxy implements AuthenticationTokenApi {

    public async findOneWithOptions(options?: FindOneOptions<AuthenticationTokenEntity>): Promise<AuthenticationTokenEntity | undefined> {
        return this.proxy(this.findOneWithOptions, arguments);
    }

    public async save(entity: AuthenticationTokenEntity): Promise<AuthenticationTokenEntity> {
        return this.proxy(this.save, arguments);
    }

    public async delete(conditions: Partial<AuthenticationTokenEntity>): Promise<void> {
        return this.proxy(this.delete, arguments);
    }
}