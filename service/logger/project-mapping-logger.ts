import { Service, Inject } from 'tyx';
import { LambdaHandlerParameter } from '../../application-container';
import { Logger } from './logger';
import { ProjectMappingLoggerApi } from '../../api/logger';
import { JiraProject } from '../../data/jira';
import { RexorProject } from '../../data/rexor';
import { Environment } from '../../environment';

@Service(ProjectMappingLoggerApi)
export class ProjectMappingLogger extends Logger implements ProjectMappingLoggerApi {

    @Inject(LambdaHandlerParameter.Event)
    private event;

    public async logSaveMappingsAction(jiraProjects: JiraProject[], rexorProject: RexorProject): Promise<any> {
        let message = `${this.getUserInfoMessage(this.event)} 
                        Action: Project mapping created.
                        Jira projects: ${JSON.stringify(jiraProjects)}.
                        Rexor project: ${JSON.stringify(rexorProject)}.
                        ${this.getTimeMessage()}.`;
        return this.insertLog(message);
    }

    public async  logDeleteMappingAction(jiraProject: JiraProject, rexorProject: RexorProject): Promise<any> {
        let message = `${this.getUserInfoMessage(this.event)} 
                        Action: Project mapping deleted.
                        Jira project: ${JSON.stringify(jiraProject)}.
                        Rexor project: ${JSON.stringify(rexorProject)}.
                        ${this.getTimeMessage()}`;
        return this.insertLog(message);
    }

    protected async getLogStreamName(): Promise<any> {
        return Environment.projectMappingLogStreamName;
    }
}