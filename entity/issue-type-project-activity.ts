import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn, RelationId } from 'typeorm';
import { JiraProjectRexorProjectEntity } from './jira-project-rexor-project';

export const IssueTypeProjectActivityTableName = "issue_type_project_activity";
export enum IssueTypeProjectActivityTableColumnName {
    id = "id",
    issueTypeId = "issue_type_id",
    projectActivityUid = "project_activity_uid",
    jiraProjectRexorProjectId = "jira_project_rexor_project_id"
}

@Entity(IssueTypeProjectActivityTableName)
export class IssueTypeProjectActivityEntity {

    @PrimaryGeneratedColumn({ name: IssueTypeProjectActivityTableColumnName.id })
    id: number;

    @Column({ name: IssueTypeProjectActivityTableColumnName.issueTypeId })
    issueTypeId: string;

    @Column({ name: IssueTypeProjectActivityTableColumnName.projectActivityUid })
    projectActivityUid: string;

    @ManyToOne(type => JiraProjectRexorProjectEntity,
        jiraProjectRexorProjectEntity => jiraProjectRexorProjectEntity.issueTypeProjectActivityEntities,
        { cascadeAll: true, eager: true })
    @JoinColumn({ name: IssueTypeProjectActivityTableColumnName.jiraProjectRexorProjectId })
    jiraProjectRexorProjectEntity?: JiraProjectRexorProjectEntity;

    @RelationId((issueTypeProjectActivityEntity: IssueTypeProjectActivityEntity) => issueTypeProjectActivityEntity.jiraProjectRexorProjectEntity)
    jiraProjectRexorProjectId: number;
}