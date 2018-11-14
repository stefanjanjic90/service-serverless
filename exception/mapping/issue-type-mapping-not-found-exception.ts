import { Exception } from '../exception';

export class IssueTypeMappingNotFoundException extends Exception {
    public constructor(errorObject?: any) {
        super(201, "Issue Type mapping not found.", errorObject);
    }
}