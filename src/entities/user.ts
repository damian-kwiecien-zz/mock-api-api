import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { Role } from './role'

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column('text')
    email: string

    @Column('text')
    password: string

    @ManyToOne(type => Role, role => role.users)
    role: Role
}

export interface UserRegisterModel {
    email: string
    password: string
    confirmPassword: string
}

export interface UserLoginModel {
    email: string
    password: string
}