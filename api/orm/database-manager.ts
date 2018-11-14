import { Service } from 'tyx';
import { Repository } from 'typeorm';
import {
    JiraProjectRexorProjectEntity,
    IssueTypeProjectActivityEntity,
    WorklogTimeTransactionEntity,
    WorklogEntity,
    WorklogTransferEntity,
    AuthenticationTokenEntity,
    AbsenceEntity,
    IssueTimeCodeEntity
} from '../../entity';

export const DatabaseManagerApi = "DatabaseManager";

/**
 * Database manager interfaces. 
 * Defines available repositories and Life-cycle events for establishin database connection and releasing.
 */
export interface DatabaseManagerApi extends Service {

    /**
     * jira_project_rexor_project MySQL table repository.
     */
    JiraProjectRexorProjectRepository: Repository<JiraProjectRexorProjectEntity>;

    /**
     * issue_type_project_activity MySQL table repository.
     */
    IssueTypeProjectActivityRepository: Repository<IssueTypeProjectActivityEntity>;

    /**
     * worklog_time_transaction MySQL table repository.
     */
    WorklogTimeTransactionRepository: Repository<WorklogTimeTransactionEntity>

    /**
    * worklog  MySQL table repository.
    */
    WorklogRepository: Repository<WorklogEntity>

    /**
    * worklog_transfer MySQL table repository.
    */
    WorklogTransferRepository: Repository<WorklogTransferEntity>

    /**
    * authentication_token MySQL table repository.
    */
    AuthenticationTokenRepository: Repository<AuthenticationTokenEntity>

    /**
    * absence MySQL table repository.
    */
    AbsenceRepository: Repository<AbsenceEntity>

    /**
    * issue_time_code MySQL table repository.
    */
    IssueTimeCodeRepository: Repository<IssueTimeCodeEntity>

    /**
    * Life-cycle handler. Executed before the service starts processing the event. Initializes all needed resources. 
    * Database connection configuration is defined togather with the Entity folder for TypeOrm.
    * Establisesh connection with the database and populates repository properties.
    * @param context context object provided by TyX framework.
    * @returns Promise of a void.
    */
    activate(): Promise<void>;

    /**
    * Life-cycle handler. Executed after the service finishes processing the event. 
    * Releases database connection and invalidates all repository properties.
    * @param context context object provided by TyX framework.
    * @returns Promise of a void.
    */
    release(): Promise<void>;
}