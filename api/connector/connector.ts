import { Service } from 'tyx';
import { AuthenticationTokenEntity } from '../../entity';

export const ConnectorApi = "Connector";

/**
 * Defines a connector for an external API authentication and authorization.
 */
export interface ConnectorApi extends Service {
    /**
     * Retrieves authorization token.
     * @returns Promise of an authorization token.
     */
    getToken(): Promise<string>;

    /**
     * Persist provided token to database.
     * @param token String value of authentication token.
     * @returns Promise of a void
     */
    persistToken(token: AuthenticationTokenEntity): Promise<void>;

    /**
    * Requests new token from the system.
    * @returns Promise of a void.
    */
    requestToken?(): Promise<AuthenticationTokenEntity>;

    /**
     * Retrives request header/query parameter name which holds the API authorization token.
     * @returns  API authorization header/query name.
     */
    getAuthorizationPropertyName(): string;
}