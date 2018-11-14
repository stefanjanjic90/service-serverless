import { Service, Inject, Internal } from "tyx";
import { FindOneOptions } from 'typeorm';
import { DatabaseManagerApi, IssueTypeProjectActivityApi } from '../../../api/orm';
import { IssueTypeProjectActivityEntity, IssueTypeProjectActivityTableColumnName } from "../../../entity";
import * as _ from "lodash";

@Service(IssueTypeProjectActivityApi)
export class IssueTypeProjectActivityService implements IssueTypeProjectActivityApi {

    @Inject(DatabaseManagerApi)
    protected databaseManager: DatabaseManagerApi;

    @Internal()
    public async save(entity: IssueTypeProjectActivityEntity): Promise<IssueTypeProjectActivityEntity> {
        return this.databaseManager.IssueTypeProjectActivityRepository.save(entity);
    }

    @Internal()
    public async delete(conditions: Partial<IssueTypeProjectActivityEntity>): Promise<void> {
        return this.databaseManager.IssueTypeProjectActivityRepository.delete(conditions);
    }

    @Internal()
    public async findOneById(id: number, options?: FindOneOptions<IssueTypeProjectActivityEntity>): Promise<IssueTypeProjectActivityEntity> {
        return this.databaseManager.IssueTypeProjectActivityRepository.findOneById(id);
    }

    @Internal()
    public async queryByColumn(columns: { id?: number, issueTypeId?: string, projectActivityUid?: string, jiraProjectRexorProjectId?: number }): Promise<IssueTypeProjectActivityEntity[]> {
        if (_.isNil(columns) || _.isEmpty(columns)) {
            let errorMessage = "No column values defined for query by column. At least one value should be defined.";
            console.log(errorMessage);
            throw new Error(errorMessage);
        }

        let issueTypeProjectActivityEntityName = "issueTypeProjectActivityEntity";
        let whereConditions: string[] = [];
        for (let columnName in columns) {
            let tableColumnName = IssueTypeProjectActivityTableColumnName[columnName];
            if (columns.hasOwnProperty(columnName) && !_.isNil(columns[columnName])) {
                let condition = `${issueTypeProjectActivityEntityName}.${tableColumnName} = :${columnName}`;
                whereConditions.push(condition);
            }
        }

        let whereClause = whereConditions.join(" and ");
        let issueTypeProjectActivityEntities = await this.databaseManager.IssueTypeProjectActivityRepository
            .createQueryBuilder(issueTypeProjectActivityEntityName)
            .where(whereClause, columns)
            .printSql()
            .getMany();

        return issueTypeProjectActivityEntities;
    }
}
