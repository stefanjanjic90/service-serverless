import { Exception } from '../exception';

export class PersonNotFoundException extends Exception {
    public constructor(personId?: any) {
        super(302, `Rexor person not found. ${personId}`);
    }
}