import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity({ name: "users" })
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string
}
