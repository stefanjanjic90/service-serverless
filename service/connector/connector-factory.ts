import { JiraConnectorApi, RexorConnectorApi } from '../../api/connector';
import { JiraConnectorService } from './jira-connector';
import { RexorConnectorService } from './rexor-connector';
import { ConnectorService } from './connector';

export class ConnectorFactory {
    static create(apiName): ConnectorService {
        switch (apiName) {
            case JiraConnectorApi:
                return new JiraConnectorService();
            case RexorConnectorApi:
                return new RexorConnectorService();
            default:
                let errorMessage = `Unknown Connector implementation. API name: ${apiName}`;
                console.log(errorMessage)
                throw new Error(errorMessage);
        }
    }
}