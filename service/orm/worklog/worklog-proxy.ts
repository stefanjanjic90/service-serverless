import { Proxy, LambdaProxy } from 'tyx';
import { FindOneOptions } from 'typeorm';
import { ApplicationContainer } from '../../../application-container';
import { WorklogApi } from '../../../api/orm';
import { WorklogEntity } from '../../../entity';

@Proxy(WorklogApi, ApplicationContainer.ApplicationName, WorklogApi)
export class WorklogProxy extends LambdaProxy implements WorklogApi {

    public async save(entity: WorklogEntity): Promise<WorklogEntity> {
        return this.proxy(this.save, arguments);
    }

    public async saveAll(entities: WorklogEntity[]): Promise<WorklogEntity[]> {
        return this.proxy(this.saveAll, arguments);
    }

    public async delete(conditions: Partial<WorklogEntity>): Promise<void> {
        return this.proxy(this.delete, arguments);
    }

    public async findOneById(id: string, options?: FindOneOptions<WorklogEntity>): Promise<WorklogEntity> {
        return this.proxy(this.findOneById, arguments);
    }
}