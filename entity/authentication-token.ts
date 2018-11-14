import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export const AuthenticationTokenTableName = "authentication_token";
export enum AuthenticationTokenColumnName {
    id = "id",
    systemCd = "system_cd",
    type = "type",
    value = "value",
    receivedOn = "received_on",
    expiresIn = "expires_in"
}

@Entity(AuthenticationTokenTableName)
export class AuthenticationTokenEntity {

    @PrimaryGeneratedColumn({ name: AuthenticationTokenColumnName.id })
    id?: number;

    @Column({ name: AuthenticationTokenColumnName.systemCd })
    systemCd: string;

    @Column({ name: AuthenticationTokenColumnName.type })
    type: string;

    @Column({ name: AuthenticationTokenColumnName.value })
    value: string;

    @Column({ name: AuthenticationTokenColumnName.receivedOn, type: "datetime" })
    receivedOn: Date;

    @Column({ name: AuthenticationTokenColumnName.expiresIn })
    expiresIn: number;
}