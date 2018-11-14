import { AbsenceEntity } from '../../entity';

export const AbsenceMappingApi = "AbsenceMapping";

/**
 * Interface defines methods for working with absence mapping.
 */
export interface AbsenceMappingApi {

    /**
     * Retrieves Absence Mapping entity based on the provied jiraProjectRexorProjecId.
     * @param jiraProjectRexorProjectId Id of the Jira and Rexor projects mapping.
     * @returns Promise of an AbsenceEntity.
     */
    get(jiraProjectRexorProjectId: number): Promise<AbsenceEntity>;

    /**
     * Inserts a new AbsenceEntity into database if one id is not specified, otherwise updates existing record.
     * @param absenceEntity AbsenceEntity object.
     * @returns Promise of a saved AbsenceEntity.
     */
    save(absenceEntity: AbsenceEntity): Promise<AbsenceEntity>;

    /**
     * Deletes AbsenceEntity from database based on the specified id.
     * @param id Id of the absence record in database.
     * @returns Promise of deleted AbsenceEntity.
     */
    delete(id: number): Promise<AbsenceEntity>
}