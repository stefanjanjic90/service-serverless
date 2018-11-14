import { Service } from "tyx";
import { ConnectorService } from './connector';
import { TempoConnectorApi } from '../../api/connector';
import { SystemCd } from '../../constants/system';
import { AuthenticationTokenEntity } from '../../entity';

@Service(TempoConnectorApi)
export class TempoConnectorService extends ConnectorService implements TempoConnectorApi {

    protected constructToken(authenticationTokenEntity: AuthenticationTokenEntity): string {
        return `${authenticationTokenEntity.value}`
    }

    protected getSystemCd(): string {
        return SystemCd.Tempo;
    }

    public getAuthorizationPropertyName(): string {
        return "tempoApiToken";
    }
}