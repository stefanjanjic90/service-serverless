import { Exception } from './exception';

export class InternalErrorException extends Exception {
    public constructor(errorObject: any) {
        super(100, "Internal error occured.", errorObject);
    }
}