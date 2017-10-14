import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { User } from './user'

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id: number

    @Column('text')
    name: string

    @OneToMany(type => User, user => user.role)
    users: User[]
    
}