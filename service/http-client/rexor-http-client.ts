import { Service, Inject, Private } from 'tyx';
import { RexorException } from '../../exception/rexor';
import { RexorHttpClientApi } from '../../api/http-client/rexor-http-client';
import { RexorConnectorApi } from '../../api/connector';
import { Environment } from '../../environment';
import { UnauthorizedRequestInterceptor } from '../connector';
import { RexorProjectType } from '../../constants/rexor';
import { TimeTransaction } from '../../data/rexor';
import * as HttpStatus from 'http-status-codes'
import * as superagent from 'superagent';

@Service(RexorHttpClientApi)
export class RexorHttpClientService implements RexorHttpClientApi {

    @Inject(RexorConnectorApi)
    private rexorConnectorService: RexorConnectorApi

    private projectUrl: string;
    private projectActivityUrl: string;
    private timeTransactionUrl: string;
    private timeCodeUrl: string;
    private personUrl: string;
    private companyUrl: string;

    constructor() {
        this.projectUrl = `${Environment.rexorApiUrl}/Project/Project`;
        this.projectActivityUrl = `${Environment.rexorApiUrl}/Project/Activity`;
        this.timeTransactionUrl = `${Environment.rexorApiUrl}/Project/TimeTransaction`;
        this.timeCodeUrl = `${Environment.rexorApiUrl}/Project/TimeCode`
        this.personUrl = `${Environment.rexorApiUrl}/Basic/Person`
        this.companyUrl = `${Environment.rexorApiUrl}/Basic/Company`;
    }

    @RexorErrorResponseInterceptor()
    @UnauthorizedRequestInterceptor((self: RexorHttpClientService) => { return self.getConnectorService(); }, 'status')
    @Private()
    public async getProjects(): Promise<any> {
        let httpAgent = await this.getHttpClient();
        let projectsResponse = await httpAgent.get(`${this.projectUrl}/${Environment.rexorAuthConfigUsername}/${RexorProjectType.UserTimeReportableProjectsWithAbsence}`)
            .then((response) => {
                return response;
            }, (errorResponse) => {
                console.log("Error while retrieving Rexor projects.", errorResponse);
                return errorResponse;
            });

        return projectsResponse;
    }

    @RexorErrorResponseInterceptor()
    @UnauthorizedRequestInterceptor((self: RexorHttpClientService) => { return self.getConnectorService(); }, 'status')
    @Private()
    public async getProject(uid: string): Promise<any> {
        let httpAgent = await this.getHttpClient();
        let projectResponse = await httpAgent.get(`${this.projectUrl}/${uid}`)
            .then((response) => {
                return response;
            }, (errorResponse) => {
                console.log("Error while retrieving Rexor Project.", errorResponse);
                return errorResponse;
            });
        return projectResponse;
    }

    @RexorErrorResponseInterceptor()
    @UnauthorizedRequestInterceptor((self: RexorHttpClientService) => { return self.getConnectorService(); }, 'status')
    @Private()
    public async getProjectActivities(companyId: string, projectId: string): Promise<any> {
        let httpAgent = await this.getHttpClient();
        let projectActivitiesResponse = await httpAgent.get(`${this.projectActivityUrl}/${companyId}/${projectId}`)
            .then((response) => {
                return response;
            }, (errorResponse) => {
                console.log("Error while retrieving Rexor Project Activities.", errorResponse);
                return errorResponse;
            });
        return projectActivitiesResponse;
    }

    @RexorErrorResponseInterceptor()
    @UnauthorizedRequestInterceptor((self: RexorHttpClientService) => { return self.getConnectorService(); }, 'status')
    @Private()
    public async getProjectActivity(uid: string): Promise<any> {
        let httpAgent = await this.getHttpClient();
        let projectActivityResponse = await httpAgent.get(`${this.projectActivityUrl}/${uid}`)
            .then((response) => {
                return response;
            }, (errorResponse) => {
                console.log(`Error while retrieving Rexor Project Activity ${uid}.`, errorResponse);
                return errorResponse;
            });
        return projectActivityResponse;
    }

    @RexorErrorResponseInterceptor()
    @UnauthorizedRequestInterceptor((self: RexorHttpClientService) => { return self.getConnectorService(); }, 'status')
    @Private()
    public async saveTimeTransaction(timeTransactions: TimeTransaction): Promise<any> {
        let httpAgent = await this.getHttpClient();
        let savedTimeTransactionResponse = await httpAgent.post(this.timeTransactionUrl)
            .send(timeTransactions)
            .set('Content-Type', 'application/json')
            .then((response) => {
                return response;
            }, (errorResponse) => {
                console.log(`Error while saving Time Transaction to Rexor .`, errorResponse);
                return errorResponse;
            });
        return savedTimeTransactionResponse;
    }

    @RexorErrorResponseInterceptor()
    @UnauthorizedRequestInterceptor((self: RexorHttpClientService) => { return self.getConnectorService(); }, 'status')
    @Private()
    public async getTimeCodes(companyId: string): Promise<any> {
        let httpAgent = await this.getHttpClient();
        let timeCodeResponse = await httpAgent.get(`${this.timeCodeUrl}/${companyId}/${Environment.rexorAuthConfigUsername}`)
            .then((response) => {
                return response;
            }, (errorResponse) => {
                console.log(`Error while geting time codes.`, errorResponse);
                return errorResponse;
            });

        return timeCodeResponse;
    }

    @RexorErrorResponseInterceptor()
    @UnauthorizedRequestInterceptor((self: RexorHttpClientService) => { return self.getConnectorService(); }, 'status')
    @Private()
    public async getPersons(): Promise<any> {
        let httpAgent = await this.getHttpClient();
        let personResponse = await httpAgent.get(this.personUrl)
            .then((response) => {
                return response;
            }, (errorResponse) => {
                console.log(`Error while geting time codes.`, errorResponse);
                return errorResponse;
            });

        return personResponse;
    }

    @RexorErrorResponseInterceptor()
    @UnauthorizedRequestInterceptor((self: RexorHttpClientService) => { return self.getConnectorService(); }, 'status')
    @Private()
    public async getCompany(uid: string): Promise<any> {
        let httpAgent = await this.getHttpClient();
        let companyResponse = await httpAgent.get(`${this.companyUrl}/${uid}`)
            .then((response) => {
                return response;
            }, (errorResponse) => {
                console.log(`Error while geting time codes.`, errorResponse);
                return errorResponse;
            });

        return companyResponse;
    }

    public async getHttpClient() {

        let defaultHeaders = {};
        defaultHeaders['Content-Type'] = 'application/json';
        defaultHeaders[this.getConnectorService().getAuthorizationPropertyName()] = await this.getConnectorService().getToken();

        return superagent.agent().set(defaultHeaders);
    }

    public getConnectorService(): RexorConnectorApi {
        return this.rexorConnectorService;
    }
}

function RexorErrorResponseInterceptor() {
    return function (target: any, propertyKey: string, propertyDescriptor: PropertyDescriptor) {
        if (!propertyDescriptor) {
            propertyDescriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
        }
        let method = propertyDescriptor.value;
        propertyDescriptor.value = async function (...args: any[]) {
            let rexorResponse = await method.apply(this, args);

            if (rexorResponse.status === HttpStatus.BAD_REQUEST) {
                throw new RexorException(JSON.parse(rexorResponse.response.text));
            }
            return rexorResponse;
        }
        return propertyDescriptor;
    }
}