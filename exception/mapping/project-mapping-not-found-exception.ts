import { Exception } from '../exception';

export class ProjectMappingNotFoundException extends Exception {
    public constructor(errorObject?: any) {
        super(200, "Project mapping not found.", errorObject);
    }
}