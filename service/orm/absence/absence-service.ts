import { Service, Inject, Internal } from "tyx";
import { FindOneOptions } from 'typeorm';
import { DatabaseManagerApi, AbsenceApi } from '../../../api/orm';
import { AbsenceEntity, AbsenceTableColumnName, IssueTimeCodeTableName } from "../../../entity";
import * as _ from "lodash";

@Service(AbsenceApi)
export class AbsenceService implements AbsenceApi {

    @Inject(DatabaseManagerApi)
    protected databaseManager: DatabaseManagerApi;

    @Internal()
    public async save(entity: AbsenceEntity): Promise<AbsenceEntity> {
        return this.databaseManager.AbsenceRepository.save(entity);
    }

    @Internal()
    public async delete(conditions: Partial<AbsenceEntity>): Promise<void> {
        return this.databaseManager.AbsenceRepository.delete(conditions);
    }

    @Internal()
    public async findOneById(id: number, options?: FindOneOptions<AbsenceEntity>): Promise<AbsenceEntity> {
        return this.databaseManager.AbsenceRepository.findOneById(id);
    }

    @Internal()
    public async queryOneByColumn(columns: { id?: number, classificationId?: string, jiraProjectRexorProjectId?: number }): Promise<AbsenceEntity> {
        if (_.isNil(columns) || _.isEmpty(columns)) {
            let errorMessage = "No column values defined for query by column. At least one value should be defined.";
            console.log(errorMessage);
            throw new Error(errorMessage);
        }

        let absenceEntityName = "absenceEntity";
        let whereConditions: string[] = [];
        for (let columnName in columns) {
            let tableColumnName = AbsenceTableColumnName[columnName];
            if (columns.hasOwnProperty(columnName) && !_.isNil(columns[columnName])) {
                let condition = `${absenceEntityName}.${tableColumnName} = :${columnName}`;
                whereConditions.push(condition);
            }
        }

        let whereClause = whereConditions.join(" and ");
        let absenceEntity = await this.databaseManager.AbsenceRepository
            .createQueryBuilder(absenceEntityName)
            .leftJoinAndSelect(`${absenceEntityName}.issueTimeCodeEntities`, IssueTimeCodeTableName)
            .where(whereClause, columns)
            .printSql()
            .getOne();

        return absenceEntity;
    }
}
