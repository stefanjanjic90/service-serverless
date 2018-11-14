import { Service, Inject, Internal } from 'tyx';
import { FindOneOptions } from 'typeorm';
import { DatabaseManagerApi, WorklogApi } from '../../../api/orm';
import { WorklogEntity } from '../../../entity';

@Service(WorklogApi)
export class WorklogService implements WorklogApi {

    @Inject(DatabaseManagerApi)
    protected databaseManager: DatabaseManagerApi;

    @Internal()
    public async save(entity: WorklogEntity): Promise<WorklogEntity> {
        return this.databaseManager.WorklogRepository.save(entity);
    }

    @Internal()
    public async saveAll(entities: WorklogEntity[]): Promise<WorklogEntity[]> {
        return this.databaseManager.WorklogRepository.save(entities);
    }

    @Internal()
    public async delete(conditions: Partial<WorklogEntity>): Promise<void> {
        return this.databaseManager.WorklogRepository.delete(conditions);
    }

    @Internal()
    public async findOneById(id: string, options?: FindOneOptions<WorklogEntity>): Promise<WorklogEntity> {
        return this.databaseManager.WorklogRepository.findOneById(id, options);
    }
}