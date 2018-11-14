import { Proxy, LambdaProxy } from "tyx";
import { FindOneOptions } from 'typeorm';
import { ApplicationContainer } from '../../../application-container';
import { IssueTimeCodeApi } from "../../../api/orm";
import { IssueTimeCodeEntity } from '../../../entity';

@Proxy(IssueTimeCodeApi, ApplicationContainer.ApplicationName, IssueTimeCodeApi)
export class IssueTimeCodeProxy extends LambdaProxy implements IssueTimeCodeApi {

    public async save(entity: IssueTimeCodeEntity): Promise<IssueTimeCodeEntity> {
        return this.proxy(this.save, arguments);
    }

    public async delete(conditions: Partial<IssueTimeCodeEntity>): Promise<void> {
        return this.proxy(this.delete, arguments);
    }

    public async findOneById(id: number, options?: FindOneOptions<IssueTimeCodeEntity>): Promise<IssueTimeCodeEntity> {
        return this.proxy(this.findOneById, arguments);
    }

    public async queryByColumn(columns: { id?: number, issueId?: string, timeCodeUid?: string, absenceId?: number }): Promise<IssueTimeCodeEntity[]> {
        return this.proxy(this.queryByColumn, arguments);
    }
}