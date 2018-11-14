import { Exception } from '../exception';

export class UndefinedUidException extends Exception {
    public constructor(requestObject?: any) {
        super(301, `Rexor returned undefined UID on persist request. Request object: ${requestObject}`);
    }
}