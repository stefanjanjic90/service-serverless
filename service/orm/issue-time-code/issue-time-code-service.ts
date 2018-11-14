import { Service, Inject, Internal } from "tyx";
import { FindOneOptions } from 'typeorm';
import { DatabaseManagerApi, IssueTimeCodeApi } from '../../../api/orm';
import { IssueTimeCodeEntity, IssueTimeCodeTableColumnName } from "../../../entity";
import * as _ from "lodash";

@Service(IssueTimeCodeApi)
export class IssueTimeCodeService implements IssueTimeCodeApi {

    @Inject(DatabaseManagerApi)
    protected databaseManager: DatabaseManagerApi;

    @Internal()
    public async save(entity: IssueTimeCodeEntity): Promise<IssueTimeCodeEntity> {
        return this.databaseManager.IssueTimeCodeRepository.save(entity);
    }

    @Internal()
    public async delete(conditions: Partial<IssueTimeCodeEntity>): Promise<void> {
        return this.databaseManager.IssueTimeCodeRepository.delete(conditions);
    }

    @Internal()
    public async findOneById(id: number, options?: FindOneOptions<IssueTimeCodeEntity>): Promise<IssueTimeCodeEntity> {
        return this.databaseManager.IssueTimeCodeRepository.findOneById(id);
    }

    @Internal()
    public async queryByColumn(columns: { id?: number, issueId?: string, timeCodeUid?: string, absenceId?: number }): Promise<IssueTimeCodeEntity[]> {
        if (_.isNil(columns) || _.isEmpty(columns)) {
            let errorMessage = "No column values defined for query by column. At least one value should be defined.";
            console.log(errorMessage);
            throw new Error(errorMessage);
        }

        let issueTimeCodeEntityName = "issueTimeCodeEntity";
        let whereConditions: string[] = [];
        for (let columnName in columns) {
            let tableColumnName = IssueTimeCodeTableColumnName[columnName];
            if (columns.hasOwnProperty(columnName) && !_.isNil(columns[columnName])) {
                let condition = `${issueTimeCodeEntityName}.${tableColumnName} = :${columnName}`;
                whereConditions.push(condition);
            }
        }

        let whereClause = whereConditions.join(" and ");
        let issueTimeCodeEntities = await this.databaseManager.IssueTimeCodeRepository
            .createQueryBuilder(issueTimeCodeEntityName)
            .where(whereClause, columns)
            .printSql()
            .getMany();

        return issueTimeCodeEntities;
    }
}
