import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export const WorklogTimeTransactionTableName = "worklog_time_transaction";
export enum WorklogTimeTransactionTableColumnName {
    id = "id",
    worklogId = "worklog_id",
    timeTransactionUid = "time_transaction_uid",
}

@Entity(WorklogTimeTransactionTableName)
export class WorklogTimeTransactionEntity {

    @PrimaryGeneratedColumn({ name: WorklogTimeTransactionTableColumnName.id })
    id?: number;

    @Column({ name: WorklogTimeTransactionTableColumnName.worklogId })
    worklogId: string;

    @Column({ name: WorklogTimeTransactionTableColumnName.timeTransactionUid })
    timeTransactionUid: string;
}