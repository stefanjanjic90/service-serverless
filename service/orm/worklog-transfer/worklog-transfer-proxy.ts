import { Proxy, LambdaProxy } from 'tyx';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { ApplicationContainer } from '../../../application-container';
import { WorklogTransferApi } from '../../../api/orm';
import { WorklogTransferEntity } from '../../../entity';

@Proxy(WorklogTransferApi, ApplicationContainer.ApplicationName, WorklogTransferApi)
export class WorklogTransferProxy extends LambdaProxy implements WorklogTransferApi {

    public async countWithOptions(options?: FindManyOptions<WorklogTransferEntity>): Promise<number> {
        return this.proxy(this.countWithOptions, arguments);
    }

    public async findWithOptions(options?: FindManyOptions<WorklogTransferEntity>): Promise<WorklogTransferEntity[]> {
        return this.proxy(this.findWithOptions, arguments);
    }

    public async save(entity: WorklogTransferEntity): Promise<WorklogTransferEntity> {
        return this.proxy(this.save, arguments);
    }

    public async saveAll(entities: WorklogTransferEntity[]): Promise<WorklogTransferEntity[]> {
        return this.proxy(this.saveAll, arguments);
    }

    public async delete(conditions: Partial<WorklogTransferEntity>): Promise<void> {
        return this.proxy(this.delete, arguments);
    }

    public async findOneWithOptions(options?: FindOneOptions<WorklogTransferEntity>): Promise<WorklogTransferEntity | undefined> {
        return this.proxy(this.findOneWithOptions, arguments);
    }

    public async findOneById(id: number): Promise<WorklogTransferEntity> {
        return this.proxy(this.findOneById, arguments);
    }

    public async queryOneByColumn(columns: { id?: number, worklogId?: string, createdBy?: string, transferStatusCd?: string }): Promise<WorklogTransferEntity> {
        return this.proxy(this.queryOneByColumn, arguments);
    }

    public async selectByWorklogIds(worklogIds: string[]): Promise<WorklogTransferEntity[]> {
        return this.proxy(this.selectByWorklogIds, arguments);
    }

    public async selectByWorklogId(worklogId: string): Promise<WorklogTransferEntity> {
        return this.proxy(this.selectByWorklogId, arguments);
    }
}