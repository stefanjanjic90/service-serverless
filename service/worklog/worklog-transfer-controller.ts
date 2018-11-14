import { Service, Public, Inject, Get, Delete, Post, Body, QueryParam, PathParam } from "tyx";
import { Environment } from '../../environment';
import { TransferStatusCd } from '../../constants/worklog';
import { TempoHttpClientApi } from "../../api/http-client";
import { LambdaHandlerParameter } from '../../application-container';
import { StateMachineApi } from '../../api/state-machine';
import { WorklogTransferControllerApi } from "../../api/worklog";
import { WorklogTimeTransactionApi, WorklogApi, WorklogTransferApi } from "../../api/orm";
import { WorklogTimeTransactionEntity, WorklogEntity, WorklogTransferEntity } from "../../entity";
import { Worklog } from "../../data/jira";
import { InternalErrorException } from '../../exception';
import * as _ from 'lodash';
import * as moment from 'moment';
import { BillingAttributes } from '../../constants/worklog/billing-attributes';
import * as escapeStringRegexp from 'escape-string-regexp';

@Service(WorklogTransferControllerApi)
export class WorklogTransferControllerService implements WorklogTransferControllerApi {

    @Inject(LambdaHandlerParameter.Event)
    private event;

    @Inject(WorklogTimeTransactionApi)
    private worklogTimeTransactionProxy: WorklogTimeTransactionApi;

    @Inject(WorklogApi)
    private worklogProxy: WorklogApi;

    @Inject(WorklogTransferApi)
    private worklogTransferProxy: WorklogTransferApi;

    @Inject(TempoHttpClientApi)
    private tempoHttpClientProxy: TempoHttpClientApi;

    @Inject(StateMachineApi)
    private stateMachineService: StateMachineApi;

    @Public()
    @Get("/worklog/transfer")
    public async getWorklogTransfers( @QueryParam('transferStatusCd') transferStatusCd): Promise<WorklogTransferEntity[]> {
        try {
            let worklogEntityArray = await this.worklogTransferProxy.findWithOptions({ where: { transferStatusCd: transferStatusCd } });
            return worklogEntityArray;
        } catch (exception) {
            console.error(`Unable to retrieve worklog transfer for given status. Status: ${transferStatusCd}`);
            let internalErrorException = new InternalErrorException(exception);
            throw internalErrorException.convertToTyxException();
        }
    }

    @Public()
    @Post("/worklog/transfer")
    public async saveWorklogTransfers( @Body() worklogEntityArray: WorklogEntity[]): Promise<WorklogEntity[]> {
        try {
            if (_.isEmpty(worklogEntityArray)) {
                throw new Error("Create Worklog transfer invoked with invalid parameters.");
            }

            let worklogTransferDbArray: WorklogTransferEntity[] = await this.worklogTransferProxy.selectByWorklogIds(_.map(worklogEntityArray, 'id'));
            let worklogTransferDbMap = _.keyBy(worklogTransferDbArray, 'worklogId');

            // filter out already saved worklog entities
            worklogEntityArray = _.filter(worklogEntityArray, (worklogEntity) => { return !_.has(worklogTransferDbMap, worklogEntity.id.toString()) });

            if (!_.isEmpty(worklogEntityArray)) {
                worklogEntityArray = this.addWorklogTransferEntities(worklogEntityArray);
                // persist worklogs and transfer data
                await this.worklogProxy.saveAll(worklogEntityArray);

                let isWorklogTransferStateMachineRunning = await this.stateMachineService
                    .isRunning(Environment.worklogTransferStateMachineArn, Environment.worklogTransferStateMachineExecutionNamePrefix);

                if (!isWorklogTransferStateMachineRunning) {
                    await this.stateMachineService.startExecution(
                        Environment.worklogTransferStateMachineArn,
                        Environment.worklogTransferStateMachineExecutionNamePrefix + "-" + moment().format("YYYY-MM-DD-HH-mm-ss"));
                }
            }

            return worklogEntityArray;

        } catch (exception) {
            console.error("Error while craeting worklogs for transfers.", exception);
            let internalErrorException = new InternalErrorException(exception);
            throw internalErrorException.convertToTyxException();
        }
    }

    @Public()
    @Delete("/worklog/transfer/{worklogId}")
    public async deleteFailedWoklogTransfer( @PathParam("worklogId") worklogId: string): Promise<WorklogTransferEntity> {
        try {
            let worklogEntity: WorklogEntity = await this.worklogProxy.findOneById(worklogId);
            let worklogTransferEntity: WorklogTransferEntity = await this.worklogTransferProxy.selectByWorklogId(worklogEntity.id);
            if (!_.isEqual(worklogTransferEntity.transferStatusCd, TransferStatusCd.Failed)) {
                throw new Error("Method accepts only requests for deleteing failed worklog transfers.");
            }

            await this.worklogProxy.delete(worklogEntity);
            return worklogTransferEntity;
        } catch (exception) {
            console.error("Unable to delete worklog transfer.", exception);
            let internalErrorException = new InternalErrorException(exception);
            throw internalErrorException.convertToTyxException();
        }
    }

    @Public()
    @Get("/worklog")
    public async getWorklogs(
        @QueryParam("dateFrom") dateFrom: string, @QueryParam("dateTo") dateTo: string,
        @QueryParam("projectKey") projectKey: string): Promise<Worklog[]> {
        try {
            let worklogDataArray = await this.tempoHttpClientProxy.getWorklogs(dateFrom, dateTo, projectKey);
            let worklogs: Worklog[] = [];
            for (let worklogData of worklogDataArray) {
                let worklog = this.getWorklog(worklogData);
                worklogs.push(worklog);
            }
            return worklogs;
        }
        catch (exception) {
            console.error("Error while retrieving worklogs.", exception);
            let internalErrorException = new InternalErrorException(exception);
            throw internalErrorException.convertToTyxException();
        }
    }

    @Public()
    @Post("/worklog/transferred")
    public async getTransferredWorklogs( @Body() worklogIds: string[]): Promise<WorklogTimeTransactionEntity[]> {
        try {
            let worklogTimeTransactionEntitiesDb: WorklogTimeTransactionEntity[] = await this.worklogTimeTransactionProxy.selectByWorklogIds(worklogIds);
            return worklogTimeTransactionEntitiesDb;
        } catch (exception) {
            console.error("Error while retrieving transfed worklogs.", exception);
            let internalErrorException = new InternalErrorException(exception);
            throw internalErrorException.convertToTyxException();
        }
    }

    private getWorklog(worklogData: any): Worklog {      
        let worklog: Worklog = {
            id: worklogData.worklog_id[0],
            username: worklogData.username[0],
            timeSpent: worklogData.hours[0],
            comment: worklogData.work_description[0],
            approvalStatus: worklogData.approval_status[0],
            workDate: worklogData.work_date[0],
            issueKey: worklogData.issue_key[0],
            issueSummary: worklogData.issue_summary[0],
            issueTypeId: worklogData.issue_details[0].type_id[0],
            projectKey: worklogData.issue_details[0].project_key[0],
            location: this.getLocation(worklogData.billing_attributes[0]),
        };
        return worklog;
    }

    private getLocation(billingAttributes: string){
        const escapedStringLocation = escapeStringRegexp(BillingAttributes.Location);
        const locationBasedPricingPattern = `${escapedStringLocation}=[\\w\\d\\-]+[\\s\\_\\-]?[\\w\\d\\-]+`;
        const locationBasedPricingResults: string[] = billingAttributes.match(locationBasedPricingPattern);
        const separator = '=';
        
        if(locationBasedPricingResults !== null){
            const locationBasedPricing = locationBasedPricingResults[0];
            const locationValue = _.trim(locationBasedPricing.split(separator)[1]);
            return locationValue;
        }
        return null;
    }

    private addWorklogTransferEntities(worklogEntityArray: WorklogEntity[]): WorklogEntity[] {

        for (let worklogEntity of worklogEntityArray) {
            let worklogTransferEntity: WorklogTransferEntity = {
                createdBy: this.event.requestContext.authorizer.userId,
                createdOn: new Date(),
                transferStatusCd: TransferStatusCd.Ready
            };
            worklogEntity.worklogTransfer = worklogTransferEntity;
        }

        return worklogEntityArray;
    }
}
