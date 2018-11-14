import { Logger } from './logger';
import { ProjectMappingLoggerApi, IssueTypeMappingLoggerApi } from '../../api/logger';
import { ProjectMappingLogger } from './project-mapping-logger';
import { IssueTypeMappingLogger } from './issue-type-mapping-logger';

export class LoggerFactory {
    static create(apiName): Logger {
        switch (apiName) {
            case ProjectMappingLoggerApi:
                return new ProjectMappingLogger();
            case IssueTypeMappingLoggerApi:
                return new IssueTypeMappingLogger();
            default:
                let errorMessage = `Unknown Logger implementation. API name: ${apiName}`;
                console.log(errorMessage)
                throw new Error(errorMessage);
        }
    }
}