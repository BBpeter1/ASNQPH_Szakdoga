import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { UserDTO } from "../../../models"
import { Book } from "./Book"

@Entity()
export class User implements UserDTO {

    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: true, type: 'text'})
    name: string

    @Column({nullable: true, type: 'text'})
    phone: string

    @Column({nullable: true,type: 'text'})
    szisz: string;

    @Column({nullable: true, type: 'text'})
    address: string;

    @Column()
    isActive:boolean;

    @OneToMany(() => User, user => user.borrowedBooks)
    borrowedBooks: Book[];

    @OneToMany(() => User, user => user.soldBooks)
    soldBooks: Book[];

    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    password: string;

}
