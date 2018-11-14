import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn, RelationId } from 'typeorm';
import { AbsenceEntity } from './absence';

export const IssueTimeCodeTableName = "issue_time_code";
export enum IssueTimeCodeTableColumnName {
    id = "id",
    issueId = "issue_id",
    timeCodeUid = "time_code_uid",
    absenceId = "absence_id",
}

@Entity(IssueTimeCodeTableName)
export class IssueTimeCodeEntity {

    @PrimaryGeneratedColumn({ name: IssueTimeCodeTableColumnName.id })
    id: number;

    @Column({ name: IssueTimeCodeTableColumnName.issueId })
    issueId: string;

    @Column({ name: IssueTimeCodeTableColumnName.timeCodeUid })
    timeCodeUid: string;

    @ManyToOne(type => AbsenceEntity, absenceEntity => absenceEntity.issueTimeCodeEntities, { cascadeAll: true, eager: true })
    @JoinColumn({ name: IssueTimeCodeTableColumnName.absenceId })
    absenceEntity?: AbsenceEntity;

    @RelationId((issueTimeCodeEntity: IssueTimeCodeEntity) => issueTimeCodeEntity.absenceEntity)
    @Column({ name: IssueTimeCodeTableColumnName.absenceId })
    absenceId?: number;
}