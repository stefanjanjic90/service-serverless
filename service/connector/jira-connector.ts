import { Service } from "tyx";
import { ConnectorService } from './connector';
import { JiraConnectorApi } from '../../api/connector';
import { SystemCd } from '../../constants/system';
import { AuthenticationTokenEntity } from '../../entity';

@Service(JiraConnectorApi)
export class JiraConnectorService extends ConnectorService implements JiraConnectorApi {

    protected constructToken(authenticationTokenEntity: AuthenticationTokenEntity): string {
        return authenticationTokenEntity.type + " " + authenticationTokenEntity.value;
    }

    protected getSystemCd(): string {
        return SystemCd.Jira;
    }
    public getAuthorizationPropertyName(): string {
        return 'Authorization';
    }
}