import { Service, Inject } from 'tyx';
import { Logger } from './logger';
import { IssueTypeMappingLoggerApi } from '../../api/logger';
import { IssueType } from '../../data/jira';
import { ProjectActivity } from '../../data/rexor';
import { Environment } from '../../environment';
import { LambdaHandlerParameter } from '../../application-container';

@Service(IssueTypeMappingLoggerApi)
export class IssueTypeMappingLogger extends Logger implements IssueTypeMappingLoggerApi {

    @Inject(LambdaHandlerParameter.Event)
    private event;

    public async  logSaveMappingAction(issueTypes: IssueType[], projectActivity: ProjectActivity): Promise<any> {
        let message = `${this.getUserInfoMessage(this.event)}
                        Action: Issue Type to Project Activity mapping created.
                        Issue Types: ${JSON.stringify(issueTypes)}.
                        Project Activity : ${JSON.stringify(projectActivity)}.
                        ${this.getTimeMessage()}`;
        return this.insertLog(message);
    }

    public async logDeleteMappingAction(issueType: IssueType, projectActivity: ProjectActivity): Promise<any> {
        let message = `${this.getUserInfoMessage(this.event)}
                        Action: Issue Type to Project Activity mapping deleted.
                        Issue Type : ${JSON.stringify(issueType)}. 
                        Project Activity : ${JSON.stringify(projectActivity)}.
                        ${this.getTimeMessage()}`;
        return this.insertLog(message);
    }

    protected async getLogStreamName(): Promise<any> {
        return Environment.issueTypeMappingLogStreamName;
    }
}