import { ApiError, ApiErrorBuilder, InternalServerError } from 'tyx';

export abstract class Exception {
    protected constructor(public code: number, public message: string, public errorObject?: any) { }

    public convertToTyxException(): ApiError {
        let internalServerErrorBuilder: ApiErrorBuilder = InternalServerError.builder();
        internalServerErrorBuilder.reason(this.code.toString(), this.message, this);
        return internalServerErrorBuilder.create();
    }
}