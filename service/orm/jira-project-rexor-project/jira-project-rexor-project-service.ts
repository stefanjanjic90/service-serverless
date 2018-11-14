import { Service, Inject, Internal } from 'tyx';
import { FindOneOptions } from 'typeorm';
import { DatabaseManagerApi, JiraProjectRexorProjectApi } from '../../../api/orm';
import { DeepPartialEntity, JiraProjectRexorProjectEntity, JiraProjectRexorProjectTableColumnName } from '../../../entity';

@Service(JiraProjectRexorProjectApi)
export class JiraProjectRexorProjectService implements JiraProjectRexorProjectApi {

    @Inject(DatabaseManagerApi)
    protected databaseManager: DatabaseManagerApi;

    @Internal()
    public async findWithConditions(conditions?: DeepPartialEntity<JiraProjectRexorProjectEntity>): Promise<JiraProjectRexorProjectEntity[]> {
        return this.databaseManager.JiraProjectRexorProjectRepository.find(conditions);
    }

    @Internal()
    public async save(entity: JiraProjectRexorProjectEntity): Promise<JiraProjectRexorProjectEntity> {
        return this.databaseManager.JiraProjectRexorProjectRepository.save(entity);
    }

    @Internal()
    public async delete(conditions: Partial<JiraProjectRexorProjectEntity>): Promise<void> {
        return this.databaseManager.JiraProjectRexorProjectRepository.delete(conditions);
    }

    @Internal()
    public async findOneWithOptions(options?: FindOneOptions<JiraProjectRexorProjectEntity>): Promise<JiraProjectRexorProjectEntity | undefined> {
        return this.databaseManager.JiraProjectRexorProjectRepository.findOne(options);
    }

    @Internal()
    public async findOneById(id: number, options?: FindOneOptions<JiraProjectRexorProjectEntity>): Promise<JiraProjectRexorProjectEntity> {
        return this.databaseManager.JiraProjectRexorProjectRepository.findOneById(id);
    }

    @Internal()
    public async selectAll(): Promise<JiraProjectRexorProjectEntity[]> {
        let jiraProjectRexorProjecEntityName = "jiraProjectRexorProjectEntity";
        let jiraProjectRexorProjecEntityArray = this.databaseManager.JiraProjectRexorProjectRepository
            .createQueryBuilder(jiraProjectRexorProjecEntityName)
            .getMany();
        return jiraProjectRexorProjecEntityArray;
    }

    @Internal()
    public async selectByJiraProjectIds(jiraProjectIds: string[]): Promise<JiraProjectRexorProjectEntity[]> {
        let jiraProjectRexorProjecEntityName = "jiraProjectRexorProjectEntity";
        let jiraProjectRexorProjecEntity = this.databaseManager.JiraProjectRexorProjectRepository
            .createQueryBuilder(jiraProjectRexorProjecEntityName)
            .where(`${jiraProjectRexorProjecEntityName}.${JiraProjectRexorProjectTableColumnName.jiraProjectId} IN (${jiraProjectIds})`)
            .printSql()
            .getMany();
        return jiraProjectRexorProjecEntity;
    }
}