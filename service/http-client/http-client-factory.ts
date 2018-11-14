import { JiraHttpClientApi } from '../../api/http-client/jira-http-client';
import { RexorHttpClientApi } from '../../api/http-client/rexor-http-client';
import { JiraHttpClientService } from './jira-http-client';
import { RexorHttpClientService } from './rexor-http-client';

export class HttpClientFactory {
    static create(apiName) {
        switch (apiName) {
            case JiraHttpClientApi:
                return new JiraHttpClientService();
            case RexorHttpClientApi:
                return new RexorHttpClientService();
            default:
                let errorMessage = `Unknown Http Client implementation. API name: ${apiName}`;
                console.log(errorMessage)
                throw new Error(errorMessage);
        }
    }
}