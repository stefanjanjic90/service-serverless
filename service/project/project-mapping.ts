import { Service, Public, Body, Inject, Post, Delete, Get, PathParam } from "tyx";
import { JiraProjectApi, RexorProjectApi } from '../../api/project';
import { ProjectMappingApi } from "../../api/project";
import { JiraProjectRexorProjectApi } from "../../api/orm";
import { JiraProjectRexorProjectEntity } from "../../entity";
import { ProjectMappingLoggerApi } from "../../api/logger";
import { InternalErrorException } from '../../exception';
import * as _ from "lodash";

@Service(ProjectMappingApi)
export class ProjectMappingService implements ProjectMappingApi {

    @Inject(ProjectMappingLoggerApi)
    private projectMappingLogger: ProjectMappingLoggerApi

    @Inject(JiraProjectRexorProjectApi)
    private jiraProjectRexorProjectProxy: JiraProjectRexorProjectApi

    @Inject(JiraProjectApi)
    private jiraProjectService: JiraProjectApi

    @Inject(RexorProjectApi)
    private rexorProjectService: RexorProjectApi

    @Public()
    @Post("/project-mapping")
    public async save( @Body() projectMappingArray: any[]): Promise<JiraProjectRexorProjectEntity[]> {
        try {
            if (!projectMappingArray || projectMappingArray.length === 0) {
                let errorMessage = "Invalid request: Mappings undefined or empty.";
                console.log(errorMessage);
                throw new Error(errorMessage);
            }

            let rexorProjectUid = projectMappingArray[0].rexorProjectUid;

            let dbProjectMappings = await this.jiraProjectRexorProjectProxy.findWithConditions({ rexorProjectUid });

            let projectMappingsToAdd = _.differenceBy(projectMappingArray, dbProjectMappings, 'jiraProjectId');

            let savedProjectMappings: JiraProjectRexorProjectEntity[] = [];
            for (let i = 0; i < projectMappingsToAdd.length; i++) {
                let savedProjectMapping = await this.jiraProjectRexorProjectProxy.save(projectMappingsToAdd[i]);
                savedProjectMappings.push(savedProjectMapping);
            }

            let jiraProjects = await this.jiraProjectService.getProjects(_.map(projectMappingsToAdd, 'jiraProjectId'));
            let rexorProject = await this.rexorProjectService.getProject(rexorProjectUid);
            await this.projectMappingLogger.logSaveMappingsAction(jiraProjects, rexorProject);

            return savedProjectMappings;

        } catch (exception) {
            console.log("Error while adding mappings.", exception);
            let internalErrorException = new InternalErrorException(exception);
            throw internalErrorException.convertToTyxException();
        }
    }

    @Public()
    @Delete("/project-mapping/{id}")
    public async delete( @PathParam('id') id: number): Promise<JiraProjectRexorProjectEntity> {
        try {
            let jiraProjectRexorProjectEntity: JiraProjectRexorProjectEntity = await this.jiraProjectRexorProjectProxy.findOneById(id);

            await this.jiraProjectRexorProjectProxy.delete({ id: jiraProjectRexorProjectEntity.id });

            let jiraProject = await this.jiraProjectService.getProject(jiraProjectRexorProjectEntity.jiraProjectId);
            let rexorProject = await this.rexorProjectService.getProject(jiraProjectRexorProjectEntity.rexorProjectUid);
            await this.projectMappingLogger.logDeleteMappingAction(jiraProject, rexorProject);

            return jiraProjectRexorProjectEntity;
        } catch (exception) {
            console.log("Error while deleting a mapping.", exception);
            let internalErrorException = new InternalErrorException(exception);
            throw internalErrorException.convertToTyxException();
        }
    }

    @Public()
    @Get("/project-mapping")
    public async getAll(): Promise<JiraProjectRexorProjectEntity[]> {
        try {
            let jiraProjectRexorProjectEntities = await this.jiraProjectRexorProjectProxy.selectAll();
            return jiraProjectRexorProjectEntities;
        } catch (exception) {
            console.log("Error while retrieving mappings.")
            let internalErrorException = new InternalErrorException(exception);
            throw internalErrorException.convertToTyxException();
        }
    }

    @Public()
    @Get("/project-mapping/{id}")
    public async get( @PathParam("id") id: number): Promise<JiraProjectRexorProjectEntity> {
        try {
            return await this.jiraProjectRexorProjectProxy.findOneById(id);
        } catch (exception) {
            console.log("Error while retrieving mapping.")
            let internalErrorException = new InternalErrorException(exception);
            throw internalErrorException.convertToTyxException();
        }
    }
}
