import { Service, Public, Body, Inject, Post, Get, Delete, PathParam, QueryParam } from "tyx";
import { JiraProjectRexorProjectApi, IssueTypeProjectActivityApi } from "../../api/orm";
import { IssueTypeMappingApi } from '../../api/project';
import { IssueTypeProjectActivityEntity } from "../../entity";
import { IssueTypeMappingLoggerApi } from "../../api/logger";
import { JiraProjectApi, RexorProjectApi } from '../../api/project';
import { InternalErrorException } from '../../exception';
import * as _ from 'lodash';

@Service(IssueTypeMappingApi)
export class IssueTypeMappingService implements IssueTypeMappingApi {

    @Inject(IssueTypeMappingLoggerApi)
    private issueTypeMappingLogger: IssueTypeMappingLoggerApi

    @Inject(IssueTypeProjectActivityApi)
    private issueTypeProjectActivityProxy: IssueTypeProjectActivityApi;

    @Inject(JiraProjectRexorProjectApi)
    private jiraProjectRexorProjectProxy: JiraProjectRexorProjectApi;

    @Inject(JiraProjectApi)
    private jiraProjectService: JiraProjectApi

    @Inject(RexorProjectApi)
    private rexorProjectService: RexorProjectApi

    @Public()
    @Get("/issue-type-mapping")
    public async get( @QueryParam("jiraProjectRexorProjectId") jiraProjectRexorProjectId: number): Promise<IssueTypeProjectActivityEntity[]> {
        try {
            let issueTypeProjectActivityEntities = await this.issueTypeProjectActivityProxy.queryByColumn({ jiraProjectRexorProjectId });
            return issueTypeProjectActivityEntities;
        } catch (exception) {
            console.log("Error on retreiving Issue Type Project Activity mapping.");
            let internalErrorException = new InternalErrorException(exception);
            throw internalErrorException.convertToTyxException();
        }
    }

    @Public()
    @Post("/issue-type-mapping")
    public async save( @Body() issueTypeMappingArray: IssueTypeProjectActivityEntity[]): Promise<IssueTypeProjectActivityEntity[]> {
        try {
            if (!issueTypeMappingArray || issueTypeMappingArray.length === 0) {
                let errorMessage = "Invalid request: Mappings undefined or empty.";
                console.log(errorMessage);
                throw new Error(errorMessage);
            }

            let jiraProjectRexorProjectId = issueTypeMappingArray[0].jiraProjectRexorProjectId;
            let projectActivityUid = issueTypeMappingArray[0].projectActivityUid;

            let jiraProjectRexorProjectEntity = await this.jiraProjectRexorProjectProxy.findOneById(jiraProjectRexorProjectId);

            let dbIssueTypeMappings: IssueTypeProjectActivityEntity[] = await this.issueTypeProjectActivityProxy.queryByColumn({
                jiraProjectRexorProjectId: jiraProjectRexorProjectId,
                projectActivityUid: projectActivityUid
            });

            let issueTypeMappingsToAdd = _.differenceBy(issueTypeMappingArray, dbIssueTypeMappings, 'issueTypeId');

            let savedIssueTypeMappings: IssueTypeProjectActivityEntity[] = [];
            for (let issueTypeMapping of issueTypeMappingsToAdd) {
                issueTypeMapping.jiraProjectRexorProjectEntity = jiraProjectRexorProjectEntity;
                let savedIssueTypeMapping = await this.issueTypeProjectActivityProxy.save(issueTypeMapping);
                savedIssueTypeMappings.push(savedIssueTypeMapping);
            }

            let issueTypes = await this.jiraProjectService.getIssueTypes(_.map(savedIssueTypeMappings, "issueTypeId"));
            let projectActivity = await this.rexorProjectService.getProjectActivity(projectActivityUid);
            await this.issueTypeMappingLogger.logSaveMappingAction(issueTypes, projectActivity);

            return savedIssueTypeMappings;
        } catch (exception) {
            console.log("Error while issue type adding mappings.");
            let internalErrorException = new InternalErrorException(exception);
            throw internalErrorException.convertToTyxException();
        }

    }

    @Public()
    @Delete("/issue-type-mapping/{id}")
    public async delete( @PathParam("id") id: number): Promise<IssueTypeProjectActivityEntity> {
        try {
            let issueTypeProjectActivityEntity = await this.issueTypeProjectActivityProxy.findOneById(id);
            await this.issueTypeProjectActivityProxy.delete({ id: issueTypeProjectActivityEntity.id });

            let issueType = await this.jiraProjectService.getIssueType(issueTypeProjectActivityEntity.issueTypeId);
            let projectActivity = await this.rexorProjectService.getProjectActivity(issueTypeProjectActivityEntity.projectActivityUid);
            await this.issueTypeMappingLogger.logDeleteMappingAction(issueType, projectActivity);

            return issueTypeProjectActivityEntity;
        } catch (exception) {
            console.log("Error on deleting Issue Type Project Activity mapping.");
            let internalErrorException = new InternalErrorException(exception);
            throw internalErrorException.convertToTyxException();
        }
    }
}