import { Service, Public, Inject, Post, Get, Delete, Body, QueryParam, PathParam } from "tyx";
import { AbsenceApi, IssueTimeCodeApi, JiraProjectRexorProjectApi } from "../../api/orm";
import { AbsenceMappingApi } from "../../api/project";
import { AbsenceEntity, IssueTimeCodeEntity } from "../../entity";
import { InternalErrorException } from '../../exception';
import * as _ from "lodash";

@Service(AbsenceMappingApi)
export class AbsenceMappingService implements AbsenceMappingApi {

    @Inject(AbsenceApi)
    private absenceProxy: AbsenceApi;

    @Inject(IssueTimeCodeApi)
    private issueTimeCodeProxy: IssueTimeCodeApi;

    @Inject(JiraProjectRexorProjectApi)
    private jiraProjectRexorProjectProxy: JiraProjectRexorProjectApi;

    @Public()
    @Get("/absence")
    public async get( @QueryParam("jiraProjectRexorProjectId") jiraProjectRexorProjectId: number): Promise<AbsenceEntity> {
        try {
            let absenceEntity: AbsenceEntity = await this.absenceProxy.queryOneByColumn({ jiraProjectRexorProjectId: jiraProjectRexorProjectId });
            return absenceEntity;
        } catch (exception) {
            console.log("Error on retreiving absence entity.");
            let internalErrorException = new InternalErrorException(exception);
            throw internalErrorException.convertToTyxException();
        }
    }

    @Public()
    @Post("/absence")
    public async save( @Body() absenceEntity: AbsenceEntity): Promise<AbsenceEntity> {
        try {
            if (!absenceEntity) {
                let errorMessage = "Invalid request: Absence Entity undefined or empty.";
                console.log(errorMessage);
                throw new Error(errorMessage);
            }

            let jiraProjectRexorProjectEntity = await this.jiraProjectRexorProjectProxy.findOneById(absenceEntity.jiraProjectRexorProjectId);
            absenceEntity.jiraProjectRexorProjectEntity = jiraProjectRexorProjectEntity;

            let issueTimeCodeEntityArray: IssueTimeCodeEntity[] = absenceEntity.issueTimeCodeEntities;
            _.unset(absenceEntity, "issueTimeCodeEntities");

            let savedAbsenceEntity = await this.absenceProxy.save(absenceEntity);

            let dbIssueMappings = await this.issueTimeCodeProxy.queryByColumn({ absenceId: savedAbsenceEntity.id });
            for (let dbIssueMapping of dbIssueMappings) {
                _.unset(dbIssueMapping, 'absenceId');
                await this.issueTimeCodeProxy.delete(dbIssueMapping);
            }

            let savedIssueMappings = [];
            for (let issueTimeCodeEntity of issueTimeCodeEntityArray) {
                issueTimeCodeEntity.absenceEntity = savedAbsenceEntity;
                let savedIssueMapping = await this.issueTimeCodeProxy.save(issueTimeCodeEntity);
                savedIssueMappings.push(savedIssueMapping);
            }
            savedAbsenceEntity.issueTimeCodeEntities = savedIssueMappings;

            return savedAbsenceEntity;
        } catch (exception) {
            console.log("Error on saving absence entity.");
            let internalErrorException = new InternalErrorException(exception);
            throw internalErrorException.convertToTyxException();
        }
    }

    @Public()
    @Delete("/absence/{id}")
    public async delete( @PathParam("id") id: number): Promise<AbsenceEntity> {
        try {
            let absenceEntity: AbsenceEntity = await this.absenceProxy.findOneById(id);
            _.unset(absenceEntity, "jiraProjectRexorProjectId");
            await this.absenceProxy.delete(absenceEntity);
            return absenceEntity;
        } catch (exception) {
            console.log("Error while deleting absence entity.");
            let internalErrorException = new InternalErrorException(exception);
            throw internalErrorException.convertToTyxException();
        }
    }
}
