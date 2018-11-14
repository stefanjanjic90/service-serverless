import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, RelationId } from 'typeorm';
import { WorklogEntity } from './worklog';

export const WorklogTransferTableName = "worklog_transfer";
export enum WorklogTransferTableColumnName {
    id = "id",
    worklogId = "worklog_id",
    createdBy = "created_by",
    createdOn = "created_on",
    transferStatusCd = "transfer_status_cd",
    transferLog = "transfer_log",
    transferredOn = "transferred_on"
}

@Entity(WorklogTransferTableName)
export class WorklogTransferEntity {

    @PrimaryGeneratedColumn({ name: WorklogTransferTableColumnName.id })
    id?: number;

    @OneToOne(type => WorklogEntity, worklog => worklog.worklogTransfer, { cascadeInsert: true, cascadeUpdate: true, eager: true })
    @JoinColumn({ name: WorklogTransferTableColumnName.worklogId })
    worklogEntity?: WorklogEntity;

    @Column({ name: WorklogTransferTableColumnName.createdBy })
    createdBy: string;

    @Column({ name: WorklogTransferTableColumnName.createdOn, type: 'datetime' })
    createdOn: Date;

    @Column({ name: WorklogTransferTableColumnName.transferStatusCd })
    transferStatusCd: string;

    @Column({ name: WorklogTransferTableColumnName.transferLog })
    transferLog?: string;

    @Column({ name: WorklogTransferTableColumnName.transferredOn, type: 'datetime' })
    transferredOn?: Date;

    @RelationId((worklogTransferEntity: WorklogTransferEntity) => worklogTransferEntity.worklogEntity)
    worklogId?: string;
}