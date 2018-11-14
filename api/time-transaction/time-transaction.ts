import { TimeTransaction } from '../../data/rexor';

export const TimeTransactionApi = "TimeTransaction";

/**
 * Rexor Time Transaction interface.
 */
export interface TimeTransactionApi {

    /**
     * Saves given time transaction to Rexor.
     * @param timeTransaction TimeTransaction object.
     * @returns Promise of a TimeTransaction object. Contains UID of persisted time transaction in Rexor.
     */
    save(timeTransaction: TimeTransaction): Promise<TimeTransaction>
}