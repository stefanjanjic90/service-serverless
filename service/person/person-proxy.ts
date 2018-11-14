import { Proxy, LambdaProxy } from 'tyx';
import { ApplicationContainer } from '../../application-container';
import { PersonApi } from '../../api/person';
import { Person } from '../../data/rexor';

@Proxy(PersonApi, ApplicationContainer.ApplicationName, PersonApi)
export class PersonProxy extends LambdaProxy implements PersonApi {

    public async getPersons(): Promise<Person[]> {
        return this.proxy(this.getPersons, arguments);
    }
}