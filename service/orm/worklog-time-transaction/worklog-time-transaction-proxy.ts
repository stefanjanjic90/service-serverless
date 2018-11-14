import { Proxy, LambdaProxy } from 'tyx';
import { FindOneOptions } from 'typeorm';
import { ApplicationContainer } from '../../../application-container';
import { WorklogTimeTransactionApi } from '../../../api/orm';
import { WorklogTimeTransactionEntity } from '../../../entity';

@Proxy(WorklogTimeTransactionApi, ApplicationContainer.ApplicationName, WorklogTimeTransactionApi)
export class WorklogTimeTransactionProxy extends LambdaProxy implements WorklogTimeTransactionApi {

    public async save(entity: WorklogTimeTransactionEntity): Promise<WorklogTimeTransactionEntity> {
        return this.proxy(this.save, arguments);
    }

    public async saveAll(entities: WorklogTimeTransactionEntity[]): Promise<WorklogTimeTransactionEntity[]> {
        return this.proxy(this.saveAll, arguments);
    }

    public async findOneById(id: number, options?: FindOneOptions<WorklogTimeTransactionEntity>): Promise<WorklogTimeTransactionEntity> {
        return this.proxy(this.findOneById, arguments);
    }

    public async delete(conditions: Partial<WorklogTimeTransactionEntity>): Promise<void> {
        return this.proxy(this.delete, arguments);
    }

    public async selectByWorklogIds(worklogIds: string[]): Promise<WorklogTimeTransactionEntity[]> {
        return this.proxy(this.selectByWorklogIds, arguments);
    }
}