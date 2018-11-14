import { Private, Inject } from 'tyx';
import { AuthenticationTokenApi } from '../../api/orm';
import { ConnectorApi } from '../../api/connector';
import { AuthenticationTokenEntity } from '../../entity';
import * as objectPath from 'object-path';
import * as HttpStatus from 'http-status-codes'
import * as _ from 'lodash';

export abstract class ConnectorService implements ConnectorApi {

    @Inject(AuthenticationTokenApi)
    private authenticationTokenProxy: AuthenticationTokenApi;

    private token: string;

    @Private()
    public async getToken(): Promise<string> {
        if (_.isEmpty(this.token)) {
            try {
                let self = this;
                let authenticationTokenEntity = await this.authenticationTokenProxy.findOneWithOptions({ where: { systemCd: self.getSystemCd() } });
                if (!_.isEmpty(authenticationTokenEntity)) {
                    this.token = this.constructToken(authenticationTokenEntity);
                }
            } catch (exception) {
                console.error(`Error occured while activating connector service. System code: ${this.getSystemCd()}`, exception);
                throw exception;
            }
        }
        return this.token;
    }

    public async persistToken(authorizationTokenEntity: AuthenticationTokenEntity): Promise<void> {
        try {
            this.token = this.constructToken(authorizationTokenEntity);

            let authenticationTokenEntityDb = await this.authenticationTokenProxy.findOneWithOptions({ where: { systemCd: authorizationTokenEntity.systemCd } });
            if (!_.isEmpty(authenticationTokenEntityDb)) {
                authorizationTokenEntity.id = authenticationTokenEntityDb.id;
            }

            await this.authenticationTokenProxy.save(authorizationTokenEntity);
        } catch (exception) {
            console.error(`Error occured while persisting a new token. System code: ${this.getSystemCd()}`, exception);
            throw exception;
        }
    }

    protected abstract getSystemCd(): string;
    protected abstract constructToken(authorizationTokenEntity: AuthenticationTokenEntity): string
    public abstract getAuthorizationPropertyName(): string;
}

/**
 * Intercepts unauthorized http requests to a specific system, and retries failed request.
 * requestToken method must be implemented on the Connector for decorator to perform re-authentication.
 * @param connectorProvider Method which retrives a Connectror used for re-authentication. Object which has the decorated method is provided as an argument.
 * @param responseStatusPath Object path for the HTTP response status(code).
 */
export function UnauthorizedRequestInterceptor(connectorProvider: (self: any) => ConnectorApi, responseStatusPath: string) {
    return function (target: any, propertyKey: string, propertyDescriptor: PropertyDescriptor) {
        if (!propertyDescriptor) {
            propertyDescriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
        }

        let method = propertyDescriptor.value;

        propertyDescriptor.value = async function (...args: any[]) {

            let response = await method.apply(this, args);
            let connector = connectorProvider(this);
            try {
                let responseStatus = objectPath.get(response, responseStatusPath);

                if (responseStatus === HttpStatus.UNAUTHORIZED || responseStatus === HttpStatus.FORBIDDEN) {
                    let authorizationTokenEntity = await connector.requestToken();
                    await connector.persistToken(authorizationTokenEntity);
                    return await method.apply(this, args);
                }
                return response;
            } catch (exception) {
                console.error(`Error occured while re-authenticating with system.`);
                throw exception;
            }
        }
        return propertyDescriptor;
    }
}