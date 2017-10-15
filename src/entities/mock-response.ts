import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import { HttpMethod } from '../constants'

@Entity()
export class MockResponse {
    @PrimaryGeneratedColumn()
    id: number

    @Column('text')
    method: HttpMethod

    @Column('text')
    endpoint: string

    @Column('longtext')
    body: string
}

export interface MockResponseAddModel {
    method: HttpMethod
    endpoint: string
    body: string
}
