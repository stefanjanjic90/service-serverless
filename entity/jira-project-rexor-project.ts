import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne } from 'typeorm';
import { IssueTypeProjectActivityEntity } from './issue-type-project-activity';
import { AbsenceEntity } from './absence';

export const JiraProjectRexorProjectTableName = "jira_project_rexor_project";
export enum JiraProjectRexorProjectTableColumnName {
    id = "id",
    jiraProjectId = "jira_project_id",
    rexorProjectUid = "rexor_project_uid",
}

@Entity(JiraProjectRexorProjectTableName)
export class JiraProjectRexorProjectEntity {

    @PrimaryGeneratedColumn({ name: JiraProjectRexorProjectTableColumnName.id })
    id: number;

    @Column({ name: JiraProjectRexorProjectTableColumnName.jiraProjectId })
    jiraProjectId: string;

    @Column({ name: JiraProjectRexorProjectTableColumnName.rexorProjectUid })
    rexorProjectUid: string;

    @OneToMany(type => IssueTypeProjectActivityEntity,
        issueTypeProjectActivityEntity => issueTypeProjectActivityEntity.jiraProjectRexorProjectEntity)
    issueTypeProjectActivityEntities: IssueTypeProjectActivityEntity[];

    @OneToOne(type => AbsenceEntity,
        absenceEntity => absenceEntity.jiraProjectRexorProjectEntity)
    absenceEntity?: AbsenceEntity;
}