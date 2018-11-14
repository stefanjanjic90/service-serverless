import { Exception } from '../exception';

export class IssueMappingNotFoundException extends Exception {
    public constructor(errorObject?: any) {
        super(202, "Issue mapping not found.", errorObject);
    }
}