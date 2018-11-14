import { Service, Inject, Internal } from 'tyx';
import { PersonApi } from '../../api/person';
import { RexorHttpClientApi } from '../../api/http-client';
import { Person } from '../../data/rexor';
import { InternalErrorException } from '../../exception';

@Service(PersonApi)
export class PersonService implements PersonApi {

    @Inject(RexorHttpClientApi)
    private rexorHttpClient: RexorHttpClientApi;

    @Internal()
    public async getPersons(): Promise<Person[]> {
        try {
            let personsResponse = await this.rexorHttpClient.getPersons();
            let personDataArray = personsResponse.body;

            let persons: Person[] = [];
            for (let personData of personDataArray) {
                let person: Person = {
                    uid: personData.UID,
                    id: personData.ID,
                    employeeNo: personData.EmployeeNo,
                    emailWork: personData.EmailWork,
                    firstName: personData.FirstName,
                    lastName: personData.LastName,
                    companyUid: personData.CompanyUID,
                    company: personData.Company
                };
                persons.push(person);
            }

            return persons;
        } catch (exception) {
            console.error('Error while retrieving persons from Rexor.', exception);
            let internalErrorException = new InternalErrorException(exception);
            throw internalErrorException.convertToTyxException();
        }
    }
}