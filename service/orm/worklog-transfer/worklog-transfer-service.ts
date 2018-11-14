import { Service, Inject, Internal } from 'tyx';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { DatabaseManagerApi, WorklogTransferApi } from '../../../api/orm';
import { WorklogTransferEntity, WorklogTransferTableColumnName, WorklogTableName } from '../../../entity';
import * as _ from 'lodash';

@Service(WorklogTransferApi)
export class WorklogTransferService implements WorklogTransferApi {

    @Inject(DatabaseManagerApi)
    protected databaseManager: DatabaseManagerApi;

    @Internal()
    public async countWithOptions(options?: FindManyOptions<WorklogTransferEntity>): Promise<number> {
        return this.databaseManager.WorklogTransferRepository.count(options);
    }

    @Internal()
    public async findWithOptions(options?: FindManyOptions<WorklogTransferEntity>): Promise<WorklogTransferEntity[]> {
        return this.databaseManager.WorklogTransferRepository.find(options);
    }

    @Internal()
    public async save(entity: WorklogTransferEntity): Promise<WorklogTransferEntity> {
        return this.databaseManager.WorklogTransferRepository.save(entity);
    }

    @Internal()
    public async saveAll(entities: WorklogTransferEntity[]): Promise<WorklogTransferEntity[]> {
        return this.databaseManager.WorklogTransferRepository.save(entities);
    }

    @Internal()
    public async delete(conditions: Partial<WorklogTransferEntity>): Promise<void> {
        return this.databaseManager.WorklogTransferRepository.delete(conditions);
    }

    @Internal()
    public async findOneWithOptions(options?: FindOneOptions<WorklogTransferEntity>): Promise<WorklogTransferEntity | undefined> {
        return this.databaseManager.WorklogTransferRepository.findOne(options);
    }

    @Internal()
    public async findOneById(id: number, options?: FindOneOptions<WorklogTransferEntity>): Promise<WorklogTransferEntity> {
        return this.databaseManager.WorklogTransferRepository.findOneById(id);
    }

    @Internal()
    public async queryOneByColumn(columns: { id?: number, worklogId?: string, createdBy?: string, transferStatusCd?: string }): Promise<WorklogTransferEntity> {
        if (_.isNil(columns) || _.isEmpty(columns)) {
            let errorMessage = "No column values defined for query by column. At least one value should be defined.";
            console.log(errorMessage);
            throw new Error(errorMessage);
        }

        let worklogTransferEntityName = "worklogTransferEntity";
        let whereConditions: string[] = [];
        for (let columnName in columns) {
            let tableColumnName = WorklogTransferTableColumnName[columnName];
            if (columns.hasOwnProperty(columnName) && !_.isNil(columns[columnName])) {
                let condition = `${worklogTransferEntityName}.${tableColumnName} = :${columnName}`;
                whereConditions.push(condition);
            }
        }

        let whereClause = whereConditions.join(" and ");
        let worklogTransferEntity = await this.databaseManager.WorklogTransferRepository
            .createQueryBuilder(worklogTransferEntityName)
            .leftJoinAndSelect(`${worklogTransferEntityName}.worklogEntity`, WorklogTableName)
            .where(whereClause, columns)
            .printSql()
            .getOne();

        return worklogTransferEntity;
    }

    @Internal()
    public async selectByWorklogIds(worklogIds: string[]): Promise<WorklogTransferEntity[]> {
        let worklogTransferEntityName = "worklogTransferEntity";
        let worklogTransferEntityArray = this.databaseManager.WorklogTransferRepository
            .createQueryBuilder(worklogTransferEntityName)
            .where(`${worklogTransferEntityName}.${WorklogTransferTableColumnName.worklogId} IN (${worklogIds})`)
            .getMany();
        return worklogTransferEntityArray;
    }

    @Internal()
    public async selectByWorklogId(worklogId: string): Promise<WorklogTransferEntity> {
        let worklogTransferEntityName = "worklogTransferEntity";
        let worklogTransferEntity = this.databaseManager.WorklogTransferRepository
            .createQueryBuilder(worklogTransferEntityName)
            .where(`${worklogTransferEntityName}.${WorklogTransferTableColumnName.worklogId} = ${worklogId}`)
            .printSql()
            .getOne();
        return worklogTransferEntity;
    }
}