import { Exception } from '../exception';

export class ReadyWorklogTransferNotFoundException extends Exception {
    public constructor() {
        super(400, "Unable to find worklog transfer with status 'ready'.");
    }
}