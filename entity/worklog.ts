import { Entity, Column, PrimaryColumn, OneToOne } from 'typeorm';
import { WorklogTransferEntity } from "./worklog-transfer";

export const WorklogTableName = "worklog";
export enum WorklogTableColumnName {
    id = "id",
    username = "username",
    timeSpent = "time_spent",
    comment = "comment",
    approvalStatus = "approval_status",
    workDate = "work_date",
    issueKey = "issue_key",
    issueSummary = "issue_summary",
    issueTypeId = "issue_type_id",
    projectKey = "project_key",
    location = "location"
}

@Entity(WorklogTableName)
export class WorklogEntity {

    @PrimaryColumn({ name: WorklogTableColumnName.id })
    id: string;

    @Column({ name: WorklogTableColumnName.username })
    username: string;

    @Column({ name: WorklogTableColumnName.timeSpent, type: 'decimal' })
    timeSpent: number;

    @Column({ name: WorklogTableColumnName.comment })
    comment: string;

    @Column({ name: WorklogTableColumnName.approvalStatus })
    approvalStatus: string;

    @Column({ name: WorklogTableColumnName.workDate, type: 'datetime' })
    workDate: Date;

    @Column({ name: WorklogTableColumnName.issueKey })
    issueKey: string;

    @Column({ name: WorklogTableColumnName.issueSummary })
    issueSummary: string;

    @Column({ name: WorklogTableColumnName.issueTypeId })
    issueTypeId: string;

    @Column({ name: WorklogTableColumnName.projectKey })
    projectKey: string;

    @OneToOne(type => WorklogTransferEntity, worklogTransfer => worklogTransfer.worklogEntity, { cascadeAll: true })
    worklogTransfer: WorklogTransferEntity

    @Column({ name: WorklogTableColumnName.location })
    location: string;

}