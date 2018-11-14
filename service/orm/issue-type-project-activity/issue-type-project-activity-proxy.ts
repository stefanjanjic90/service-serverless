import { Proxy, LambdaProxy } from "tyx";
import { FindOneOptions } from 'typeorm';
import { ApplicationContainer } from '../../../application-container';
import { IssueTypeProjectActivityApi } from "../../../api/orm";
import { IssueTypeProjectActivityEntity } from '../../../entity';

@Proxy(IssueTypeProjectActivityApi, ApplicationContainer.ApplicationName, IssueTypeProjectActivityApi)
export class IssueTypeProjectActivityProxy extends LambdaProxy implements IssueTypeProjectActivityApi {

    public async save(entity: IssueTypeProjectActivityEntity): Promise<IssueTypeProjectActivityEntity> {
        return this.proxy(this.save, arguments);
    }

    public async delete(conditions: Partial<IssueTypeProjectActivityEntity>): Promise<void> {
        return this.proxy(this.delete, arguments);
    }

    public async findOneById(id: number, options?: FindOneOptions<IssueTypeProjectActivityEntity>): Promise<IssueTypeProjectActivityEntity> {
        return this.proxy(this.findOneById, arguments);
    }

    public async queryByColumn(columns: { id?: number, issueTypeId?: string, projectActivityUid?: string, jiraProjectRexorProjectId?: number }): Promise<IssueTypeProjectActivityEntity[]> {
        return this.proxy(this.queryByColumn, arguments);
    }
}