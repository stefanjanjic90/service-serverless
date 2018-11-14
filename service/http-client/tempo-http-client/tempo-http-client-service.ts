import { Service, Internal, Inject } from 'tyx';
import { TempoHttpClientApi } from '../../../api/http-client';
import { TempoConnectorApi } from '../../../api/connector';
import { Environment } from '../../../environment';
import * as xml2js from 'xml2js';
import * as superagent from 'superagent';

@Service(TempoHttpClientApi)
export class TempoHttpClientService implements TempoHttpClientApi {

    @Inject(TempoConnectorApi)
    private tempoConnectorService: TempoConnectorApi;

    private worklogUrl: string;
    private format: string;
    private addApprovalStatus: boolean;
    private addIssueDetails: boolean;
    private addIssueSummary: boolean;

    constructor() {
        this.worklogUrl = Environment.tempoApiUrl + "/getWorklog";
        this.format = "xml";
        this.addApprovalStatus = true;
        this.addIssueDetails = true;
        this.addIssueSummary = true;
    }

    @Internal()
    public async getWorklogs(dateFrom: string, dateTo: string, projectKey?: string): Promise<any> {
        try {
            let queryParametersString = this.getQueryParametersString(dateFrom, dateTo, projectKey);

            let httpClient = await this.getHttpClient();
            let worklogsResponse = await httpClient.get(this.worklogUrl)
                .query(queryParametersString)
                .then((response) => {
                    return response;
                }, (errorResponse) => {
                    console.error("Error while retrieving Tempo worklogs.", errorResponse);
                    throw new Error(errorResponse);
                });

            let worklogs = this.convertWorklogXml(worklogsResponse.text);

            return worklogs;

        } catch (exception) {
            console.error("Error occured while retrieving Tempo worklogs. ", exception);
            throw exception;
        }
    }

    public async getHttpClient() {
        let httpClient = superagent.agent();
        let authorizationQuery = {};
        authorizationQuery[this.getConnectorService().getAuthorizationPropertyName()] = await this.getConnectorService().getToken();
        authorizationQuery['baseUrl'] = Environment.companyDomainJiraDomainBaseUrl;
        httpClient.query(authorizationQuery);
        return httpClient;
    }

    public getConnectorService(): TempoConnectorApi {
        return this.tempoConnectorService;
    }

    private getQueryParametersString(dateFrom?: string, dateTo?: string, projectKey?: string): string {
        
        let queryParameters: string[] = [];
        dateFrom ? queryParameters.push(`dateFrom=${dateFrom}`) : queryParameters;
        dateTo ? queryParameters.push(`dateTo=${dateTo}`) : queryParameters;
        projectKey ? queryParameters.push(`projectKey=${projectKey}`) : queryParameters;

        queryParameters.push(`format=${this.format}`);
        queryParameters.push(`addApprovalStatus=${this.addApprovalStatus}`);
        queryParameters.push(`addIssueDetails=${this.addIssueDetails}`);
        queryParameters.push(`addIssueSummary=${this.addIssueSummary}`);

        let queryParametersString = queryParameters.join("&");
        return queryParametersString;
    }

    private convertWorklogXml(worklogXml: string): any {

        let parser = new xml2js.Parser();
        let worklogs = [];

        parser.parseString(worklogXml, function (error, result) {
            if (error !== null && error !== undefined) {
                let errorMessage = "Error while convering worklog XML to object.";
                console.error(errorMessage);
                throw new Error(errorMessage);
            }
            if (parseInt(result.worklogs.$.number_of_worklogs) > 0) {
                worklogs = result.worklogs.worklog;
            }
        });

        return worklogs;
    }
}