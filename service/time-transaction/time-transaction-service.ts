import { Service, Inject, Internal } from 'tyx';
import { TimeTransactionApi } from '../../api/time-transaction';
import { RexorHttpClientApi } from '../../api/http-client';
import { TimeTransaction } from '../../data/rexor';
import { InternalErrorException } from '../../exception';

@Service(TimeTransactionApi)
export class TimeTransactionService implements TimeTransactionApi {

    @Inject(RexorHttpClientApi)
    private rexorHttpClient: RexorHttpClientApi;

    @Internal()
    public async save(timeTransaction: TimeTransaction): Promise<TimeTransaction> {
        try {
            console.info(`Save time transaction request. Time Transaction : ${timeTransaction}`);
            let saveTimeTransactionsResponse = await this.rexorHttpClient.saveTimeTransaction(timeTransaction);
            console.info(`Save time transaction response. Response : ${saveTimeTransactionsResponse}`);

            let timeTransactionData = saveTimeTransactionsResponse.body;
            let savedTimeTransaction: TimeTransaction = {
                UID: timeTransactionData.UID,
                ProjectCompanyID: timeTransactionData.ProjectCompanyID,
                ProjectID: timeTransactionData.ProjectID,
                ProjectActivityID: timeTransactionData.ProjectActivityID,
                ResourceID: timeTransactionData.ResourceID,
                RegistrationDate: timeTransactionData.RegistrationDate,
                Number: timeTransactionData.Number,
                InvoicedNumber: timeTransactionData.InvoicedNumber,
                InvoiceText: timeTransactionData.InvoiceText,
                Description: timeTransactionData.Description,
                DescriptionInternal: timeTransactionData.DescriptionInternal,
                Status: timeTransactionData.Status,
                InvoiceStatus: timeTransactionData.InvoiceStatus,
                Tag: timeTransactionData.Tag
            };

            return savedTimeTransaction;
        } catch (exception) {
            console.error('Error while saving time transactions.', exception);
            let internalErrorException = new InternalErrorException(exception);
            throw internalErrorException.convertToTyxException();
        }
    }
}








