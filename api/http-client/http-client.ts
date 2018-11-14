import { ConnectorApi } from '../connector';
export const HttpClientApi = "HttpClient";

/**
 * General HTTP Client interface for an external API.
 */
export interface HttpClientApi {

    getHttpClient?();
    getConnectorService?(): ConnectorApi;

}