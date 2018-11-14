import { Proxy, LambdaProxy } from "tyx";
import { FindOneOptions } from 'typeorm';
import { ApplicationContainer } from '../../../application-container';
import { AbsenceApi } from "../../../api/orm";
import { AbsenceEntity } from '../../../entity';

@Proxy(AbsenceApi, ApplicationContainer.ApplicationName, AbsenceApi)
export class AbsenceProxy extends LambdaProxy implements AbsenceApi {

    public async save(entity: AbsenceEntity): Promise<AbsenceEntity> {
        return this.proxy(this.save, arguments);
    }

    public async delete(conditions: Partial<AbsenceEntity>): Promise<void> {
        return this.proxy(this.delete, arguments);
    }

    public async findOneById(id: number, options?: FindOneOptions<AbsenceEntity>): Promise<AbsenceEntity> {
        return this.proxy(this.findOneById, arguments);
    }

    public async queryOneByColumn(columns: { id?: number, classificationId?: string, jiraProjectRexorProjectId?: number }): Promise<AbsenceEntity> {
        return this.proxy(this.queryOneByColumn, arguments);
    }
}