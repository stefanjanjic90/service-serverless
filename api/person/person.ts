import { Service } from 'tyx';
import { Person } from '../../data/rexor';

export const PersonApi = "Person";

/**
 * Interfaces provides methods for working with Rexor companies and it's related objects.
 */
export interface PersonApi extends Service {

    /**
     * Requests a Rexor persons(users).
     * Transforms the HTTP response into array of Person objects.
     * @returns Promise of an Persons array.
     */
    getPersons(): Promise<Person[]>;
}