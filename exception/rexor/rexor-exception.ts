import { Exception } from '../exception';

export interface RexorError {
    FaultType: string,
    Type?: string,
    Message: string,
    FullMessage?: string,
    ErrorCode: number,
    StatusCode: number
}

export class RexorException extends Exception {
    public constructor(rexorError: RexorError) {
        super(300, rexorError.Message);
    }
}