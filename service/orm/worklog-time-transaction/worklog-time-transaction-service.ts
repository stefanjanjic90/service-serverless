import { Service, Inject, Internal } from 'tyx';
import { FindOneOptions } from 'typeorm';
import { DatabaseManagerApi, WorklogTimeTransactionApi } from '../../../api/orm';
import {
    WorklogTimeTransactionEntity,
    WorklogTimeTransactionTableColumnName
} from '../../../entity';

@Service(WorklogTimeTransactionApi)
export class WorklogTimeTransactionService implements WorklogTimeTransactionApi {

    @Inject(DatabaseManagerApi)
    protected databaseManager: DatabaseManagerApi;

    @Internal()
    public async save(entity: WorklogTimeTransactionEntity): Promise<WorklogTimeTransactionEntity> {
        return this.databaseManager.WorklogTimeTransactionRepository.save(entity);
    }

    @Internal()
    public async saveAll(entities: WorklogTimeTransactionEntity[]): Promise<WorklogTimeTransactionEntity[]> {
        return this.databaseManager.WorklogTimeTransactionRepository.save(entities);
    }

    @Internal()
    public async delete(conditions: Partial<WorklogTimeTransactionEntity>): Promise<void> {
        return this.databaseManager.WorklogTimeTransactionRepository.delete(conditions);
    }

    @Internal()
    public async findOneById(id: number, options?: FindOneOptions<WorklogTimeTransactionEntity>): Promise<WorklogTimeTransactionEntity> {
        return this.databaseManager.WorklogTimeTransactionRepository.findOneById(id);
    }

    @Internal()
    public async selectByWorklogIds(worklogIds: string[]): Promise<WorklogTimeTransactionEntity[]> {
        let worklogTimeTransactionEntityName = "worklogTimeTransactionEntity";
        let worklogTimeTransactionEntity = this.databaseManager.WorklogTimeTransactionRepository
            .createQueryBuilder(worklogTimeTransactionEntityName)
            .where(`${worklogTimeTransactionEntityName}.${WorklogTimeTransactionTableColumnName.worklogId} IN (${worklogIds})`)
            .printSql()
            .getMany();
        return worklogTimeTransactionEntity;
    }
}