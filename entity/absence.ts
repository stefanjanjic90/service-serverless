import { Entity, Column, OneToOne, OneToMany, PrimaryGeneratedColumn, JoinColumn, RelationId } from 'typeorm';
import { JiraProjectRexorProjectEntity } from './jira-project-rexor-project';
import { IssueTimeCodeEntity } from './issue-time-code';

export const AbsenceTableName = "absence";
export enum AbsenceTableColumnName {
    id = "id",
    classificationId = "classification_id",
    jiraProjectRexorProjectId = "jira_project_rexor_project_id",
}

@Entity(AbsenceTableName)
export class AbsenceEntity {

    @PrimaryGeneratedColumn({ name: AbsenceTableColumnName.id })
    id: number;

    @Column({ name: AbsenceTableColumnName.classificationId })
    classificationId: string;

    @OneToOne(type => JiraProjectRexorProjectEntity, {})
    @JoinColumn({ name: AbsenceTableColumnName.jiraProjectRexorProjectId })
    jiraProjectRexorProjectEntity?: JiraProjectRexorProjectEntity;

    @RelationId((absenceEntity: AbsenceEntity) => absenceEntity.jiraProjectRexorProjectEntity)
    jiraProjectRexorProjectId?: number;

    @OneToMany(type => IssueTimeCodeEntity, issueTimeCodeEntity => issueTimeCodeEntity.absenceEntity)
    issueTimeCodeEntities: IssueTimeCodeEntity[];
}