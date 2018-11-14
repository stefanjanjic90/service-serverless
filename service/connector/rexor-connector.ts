import { Service, Private } from "tyx";
import { Environment } from "../../environment";
import { ConnectorService } from './connector';
import { RexorConnectorApi } from "../../api/connector";
import * as superagent from 'superagent';
import * as _ from 'lodash';
import { SystemCd } from '../../constants/system';
import { AuthenticationTokenEntity } from '../../entity';

@Service(RexorConnectorApi)
export class RexorConnectorService extends ConnectorService implements RexorConnectorApi {

    public async requestToken(): Promise<AuthenticationTokenEntity> {
        let authenticationTokenEntity = await superagent.post(Environment.rexorAuthConfigAuthenticationUrl)
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send({
                "grant_type": Environment.rexorAuthConfigGrantType,
                "client_id": Environment.rexorAuthConfigClientId,
                "username": Environment.rexorAuthConfigUsername,
                "password": Environment.rexorAuthConfigPassword
            })
            .then((response) => {
                let self = this;
                return {
                    systemCd: self.getSystemCd(),
                    type: response.body.token_type,
                    value: response.body.access_token,
                    receivedOn: new Date(),
                    expiresIn: response.body.expires_in
                };
            },  (exception) => {
                console.error('Rexor session request error.', exception);
                throw exception;
            });
        return authenticationTokenEntity;
    }

    @Private()
    public async getToken(): Promise<string>{
        let token = await super.getToken();
        if (_.isEmpty(token)) {
            let authenticationTokenEntity = await this.requestToken();
            await this.persistToken(authenticationTokenEntity);
            token =  this.constructToken(authenticationTokenEntity);
        }
        return token;
    }

    protected getSystemCd(): string {
        return SystemCd.Rexor;
    }

    protected constructToken(authenticationTokenEntity: AuthenticationTokenEntity): string {
        return `${authenticationTokenEntity.type} ${authenticationTokenEntity.value}`;
    }

    public getAuthorizationPropertyName(): string {
        return 'Authorization';
    }
}