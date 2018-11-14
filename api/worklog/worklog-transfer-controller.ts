import { Worklog } from '../../data/jira';
import { WorklogTimeTransactionEntity, WorklogEntity, WorklogTransferEntity } from '../../entity';

export const WorklogTransferControllerApi = "WorklogTransferController";

/**
 * JIRA worklogs transfer controller interface.
 */
export interface WorklogTransferControllerApi {

    /**
     * Creates worklog transfers with ready status for a provided array of Worklog Entities.
     * Checks the status of worklog transfer state machine and starts execution if it is not running.
     * @param worklogEntityArray Worklogs to queue for transfer.
     * @return Promise of saved WorklogEntity array.
     */
    saveWorklogTransfers(worklogEntityArray: WorklogEntity[]): Promise<WorklogEntity[]>

    /**
     * Retrieves worklogs based on the provided filters. 
     * @param dataFrom Period start date for the search.
     * @param dateTo Period end date for the search.
     * @param projectKey Key of the project from which to retrieve worklogs.
     * @returns Promise of a Worklog array.
     */
    getWorklogs(dateFrom: string, dateTo: string, projectKey: string): Promise<Worklog[]>;

    /**
     * Deletes failed Worklog transfer.
     * @param worklogId Id of the worklog.
     * @returns Promise of deleted WorklogEntity.
     */
    deleteFailedWoklogTransfer(worklogId: string): Promise<WorklogTransferEntity>;

    /**
     * Performs database search for worklogs that have been transferred based on the provided list of ids.
     * Retrieves matches in form of WorklogTimeTransaction entities which represent successfull transfers.
     * @param worklogIds Array of worklogs ids that are checked whether they are transferred.
     */
    getTransferredWorklogs(worklogIds: string[]): Promise<WorklogTimeTransactionEntity[]>;
}