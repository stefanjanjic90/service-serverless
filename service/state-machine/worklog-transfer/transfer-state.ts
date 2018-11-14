import { ContainerInstance } from 'tyx';
import { ApplicationContainer } from '../../../application-container';
import { State, StateEvent, StateContext, StateCallback } from '../state';
import { TimeTransactionApi } from '../../../api/time-transaction';
import { CompanyApi } from '../../../api/company';
import { PersonApi } from '../../../api/person';
import { JiraProjectApi, RexorProjectApi } from '../../../api/project';
import { WorklogTransferApi, WorklogTimeTransactionApi, JiraProjectRexorProjectApi, IssueTypeProjectActivityApi, AbsenceApi } from '../../../api/orm';
import { TimeTransactionStatus, TimeTransactionInvoiceStatus, TimeTransactionTag } from '../../../constants/rexor';
import { TransferStatusCd } from '../../../constants/worklog';
import { WorklogEntity, WorklogTransferEntity, WorklogTimeTransactionEntity, JiraProjectRexorProjectEntity, IssueTypeProjectActivityEntity, AbsenceEntity, IssueTimeCodeEntity } from '../../../entity';
import { RexorProject, ProjectActivity, TimeTransaction, Person, Company } from '../../../data/rexor';
import { JiraProject, Issue } from '../../../data/jira';
import { UndefinedUidException, PersonNotFoundException } from '../../../exception/rexor';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ProjectMappingNotFoundException, IssueTypeMappingNotFoundException, IssueMappingNotFoundException } from '../../../exception/mapping';

export class TransferState extends State {

    private jiraProjectProxy: JiraProjectApi;
    private rexorProjectProxy: RexorProjectApi;
    private worklogTransferProxy: WorklogTransferApi;
    private worklogTimeTransactionProxy: WorklogTimeTransactionApi;
    private jiraProjectRexorProjectProxy: JiraProjectRexorProjectApi;
    private issueTypeProjectActivityProxy: IssueTypeProjectActivityApi;
    private timeTransactionProxy: TimeTransactionApi;
    private companyProxy: CompanyApi;
    private personProxy: PersonApi;
    private absenceProxy: AbsenceApi;

    private readonly defaultStateOutput = {};

    constructor(containerInstance?: ContainerInstance) {
        super(containerInstance);
        this.jiraProjectProxy = this.containerInstance.get(ApplicationContainer.ApplicationName + ":" + JiraProjectApi);
        this.rexorProjectProxy = this.containerInstance.get(ApplicationContainer.ApplicationName + ":" + RexorProjectApi);
        this.worklogTransferProxy = this.containerInstance.get(ApplicationContainer.ApplicationName + ":" + WorklogTransferApi);
        this.worklogTimeTransactionProxy = this.containerInstance.get(ApplicationContainer.ApplicationName + ":" + WorklogTimeTransactionApi);
        this.jiraProjectRexorProjectProxy = this.containerInstance.get(ApplicationContainer.ApplicationName + ":" + JiraProjectRexorProjectApi);
        this.issueTypeProjectActivityProxy = this.containerInstance.get(ApplicationContainer.ApplicationName + ":" + IssueTypeProjectActivityApi);
        this.timeTransactionProxy = this.containerInstance.get(ApplicationContainer.ApplicationName + ":" + TimeTransactionApi);
        this.companyProxy = this.containerInstance.get(ApplicationContainer.ApplicationName + ":" + CompanyApi);
        this.personProxy = this.containerInstance.get(ApplicationContainer.ApplicationName + ":" + PersonApi);
        this.absenceProxy = this.containerInstance.get(ApplicationContainer.ApplicationName + ":" + AbsenceApi);
    }

    async handler(event: StateEvent, context: StateContext, callback: StateCallback) {
        let worklogTransferEntity = event as WorklogTransferEntity;
        try {
            console.info(`Transfering worklog: ${JSON.stringify(worklogTransferEntity)}`);

            let timeTransaction: TimeTransaction = await this.getTimeTransaction(worklogTransferEntity);
            console.info(`Constructed time transaction: ${JSON.stringify(timeTransaction)}`);

            let savedTimeTransaction: TimeTransaction = await this.timeTransactionProxy.save(timeTransaction);
            console.info(`Saved time transaction: ${JSON.stringify(savedTimeTransaction)}`);

            if (_.isEmpty(savedTimeTransaction.UID)) {
                throw new UndefinedUidException(savedTimeTransaction);
            }

            await this.completeWorklogTransfer(worklogTransferEntity, savedTimeTransaction);

        } catch (exception) {
            console.error(`Error occured while executing worklog transfer.`, exception);
            await this.failWorklogTransfer(worklogTransferEntity, JSON.stringify(exception));
        } finally {
            callback(null, this.defaultStateOutput);
        }
    }

    private async getTimeTransaction(worklogTransferEntity: WorklogTransferEntity): Promise<TimeTransaction> {

        let jiraProject: JiraProject = await this.jiraProjectProxy.getProject(worklogTransferEntity.worklogEntity.projectKey);

        let jiraProjectRexorProjectEntity: JiraProjectRexorProjectEntity = await this.jiraProjectRexorProjectProxy.findOneWithOptions({ where: { jiraProjectId: jiraProject.id } });
        if (_.isEmpty(jiraProjectRexorProjectEntity)) {
            throw new ProjectMappingNotFoundException(`No project mapping found for worklog transfer: ${JSON.stringify(worklogTransferEntity)}`);
        }
        console.info(`Using Project mapping:${JSON.stringify(jiraProjectRexorProjectEntity)}`);

        let rexorProject: RexorProject = await this.rexorProjectProxy.getProject(jiraProjectRexorProjectEntity.rexorProjectUid);

        let invoiceText: string = this.getInvoiceText(worklogTransferEntity.worklogEntity);
        let description: string = this.getDescription(worklogTransferEntity.worklogEntity);
        let registrationDate: string = moment(worklogTransferEntity.worklogEntity.workDate).format();

        let timeTransaction: TimeTransaction = {
            ProjectID: rexorProject.id,
            ProjectCompanyID: rexorProject.companyId,
            ResourceID: worklogTransferEntity.worklogEntity.username,
            RegistrationDate: registrationDate,
            Number: worklogTransferEntity.worklogEntity.timeSpent,
            InvoicedNumber: worklogTransferEntity.worklogEntity.timeSpent,
            InvoiceText: invoiceText,
            Description: description,
            DescriptionInternal: invoiceText,
            Status: TimeTransactionStatus.Approved,
            InvoiceStatus: TimeTransactionInvoiceStatus.ReadyForInvoiceBasis,
            Tag: TimeTransactionTag.Approved
        };

        let absenceEntity: AbsenceEntity = await this.absenceProxy.queryOneByColumn({ jiraProjectRexorProjectId: jiraProjectRexorProjectEntity.id });
        if (!_.isEmpty(absenceEntity)) {
            console.info("Constructing adding absence time transaction properties.");
            let issue: Issue = await this.jiraProjectProxy.getIssue(worklogTransferEntity.worklogEntity.issueKey);
            let issueTimeCodeEntity: IssueTimeCodeEntity = _.filter(absenceEntity.issueTimeCodeEntities, (issueTimeCodeEntity) => {
                return issueTimeCodeEntity.issueId === issue.id
            })[0];

            if (_.isEmpty(issueTimeCodeEntity)) {
                throw new IssueMappingNotFoundException(`No issue mapping found for worklog transfer: ${JSON.stringify(worklogTransferEntity)}`);
            }
            console.info(`Using Issue mapping: ${JSON.stringify(issueTimeCodeEntity)}`);

            let persons: Person[] = await this.personProxy.getPersons();
            let person = _.filter(persons, (person: Person) => { return person.id === worklogTransferEntity.worklogEntity.username; })[0];

            if (_.isNil(person) || _.isEmpty(person)) {
                throw new PersonNotFoundException(worklogTransferEntity.worklogEntity.username);
            }
            console.info(`Using Rexor Person: ${JSON.stringify(person)}`);

            let company: Company = await this.companyProxy.getCompany(person.companyUid);
            console.info(`Using Rexor Company: ${JSON.stringify(company)}`);

            timeTransaction.ProjectCompanyID = company.id; // override project company with company defined for Rexor person(user)
            timeTransaction.ClassificationID = absenceEntity.classificationId
            timeTransaction.TimeCodeUID = issueTimeCodeEntity.timeCodeUid;
        } else {
            console.info("Constructing project activity properties.");
            let issueTypeProjectActivityArray: IssueTypeProjectActivityEntity[] = await this.issueTypeProjectActivityProxy.queryByColumn({ issueTypeId: worklogTransferEntity.worklogEntity.issueTypeId, jiraProjectRexorProjectId: jiraProjectRexorProjectEntity.id });
            let issueTypeProjectEntity = issueTypeProjectActivityArray[0];

            if (_.isEmpty(issueTypeProjectEntity)) {
                throw new IssueTypeMappingNotFoundException(`No issue type mapping found for worklog transfer: ${JSON.stringify(worklogTransferEntity)}`);
            }

            console.info(`Using Issue Type mapping: ${JSON.stringify(issueTypeProjectActivityArray)}`);
            let projectActivity: ProjectActivity = await this.rexorProjectProxy.getProjectActivity(issueTypeProjectEntity.projectActivityUid);
            timeTransaction.ProjectActivityID = this.getProjectActivityId(worklogTransferEntity, projectActivity);
        }

        return timeTransaction;
    }

    private getProjectActivityId(worklogTransferEntity: WorklogTransferEntity, projectActivity: ProjectActivity){
        return _.isNil(worklogTransferEntity.worklogEntity.location) ? projectActivity.id : 
                                                                    projectActivity.id + ' ' + worklogTransferEntity.worklogEntity.location;
    }

    private getInvoiceText(worklogEntity: WorklogEntity): string {
        return worklogEntity.id + ': ' + worklogEntity.issueKey + ': ' + worklogEntity.issueSummary;
    }

    private getDescription(worklogEntity: WorklogEntity): string {
        return worklogEntity.issueKey + ': ' + worklogEntity.issueSummary;
    }

    private async completeWorklogTransfer(worklogTransferEntity: WorklogTransferEntity, savedTimeTransaction: TimeTransaction): Promise<void> {

        worklogTransferEntity.transferredOn = new Date();
        worklogTransferEntity.transferStatusCd = TransferStatusCd.Complete;
        worklogTransferEntity.transferLog = "Successfull worklog transfer.";
        await this.worklogTransferProxy.save(worklogTransferEntity);

        let worklogTimeTransactionEntity: WorklogTimeTransactionEntity = {
            worklogId: worklogTransferEntity.worklogEntity.id,
            timeTransactionUid: savedTimeTransaction.UID
        };
        await this.worklogTimeTransactionProxy.save(worklogTimeTransactionEntity);
    }

    private async failWorklogTransfer(worklogTransfer: WorklogTransferEntity, transferLog: string): Promise<WorklogTransferEntity> {
        worklogTransfer.transferStatusCd = TransferStatusCd.Failed;
        worklogTransfer.transferLog = transferLog;
        return await this.worklogTransferProxy.save(worklogTransfer);
    }
}