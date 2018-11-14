import { Proxy, LambdaProxy } from 'tyx';
import { FindOneOptions } from 'typeorm';
import { ApplicationContainer } from '../../../application-container';
import { JiraProjectRexorProjectApi } from '../../../api/orm';
import { DeepPartialEntity, JiraProjectRexorProjectEntity } from '../../../entity';

@Proxy(JiraProjectRexorProjectApi, ApplicationContainer.ApplicationName, JiraProjectRexorProjectApi)
export class JiraProjectRexorProjectProxy extends LambdaProxy implements JiraProjectRexorProjectApi {

    public async findWithConditions(conditions?: DeepPartialEntity<JiraProjectRexorProjectEntity>): Promise<JiraProjectRexorProjectEntity[]> {
        return this.proxy(this.findWithConditions, arguments);
    }

    public async save(entity: JiraProjectRexorProjectEntity): Promise<JiraProjectRexorProjectEntity> {
        return this.proxy(this.save, arguments);
    }

    public async delete(conditions: Partial<JiraProjectRexorProjectEntity>): Promise<void> {
        return this.proxy(this.delete, arguments);
    }

    public async findOneWithOptions(options?: FindOneOptions<JiraProjectRexorProjectEntity>): Promise<JiraProjectRexorProjectEntity | undefined> {
        return this.proxy(this.findOneWithOptions, arguments);
    }

    public async findOneById(id: number, options?: FindOneOptions<JiraProjectRexorProjectEntity>): Promise<JiraProjectRexorProjectEntity> {
        return this.proxy(this.findOneById, arguments);
    }

    public async selectAll(): Promise<JiraProjectRexorProjectEntity[]> {
        return this.proxy(this.selectAll, arguments);
    }

    public async selectByJiraProjectIds(jiraProjectIds: string[]): Promise<JiraProjectRexorProjectEntity[]> {
        return this.proxy(this.selectByJiraProjectIds, arguments);
    }
}