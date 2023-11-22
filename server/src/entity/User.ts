import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { UserDTO } from "../../../models"
import { Book } from "./Book"

@Entity()
export class User implements UserDTO {

    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: false, type: 'text'})
    name: string

    @Column({nullable: false, type: 'text'})
    phone: string

    @Column({nullable: false,type: 'text'})
    szisz: string;

    @Column({nullable: false, type: 'text'})
    address: string;

    @Column()
    isActive:boolean;

    @Column()
    isAdmin: boolean;

    @OneToMany(() => Book, book => book.borrower)
    borrowedBooks: Book[];

    @OneToMany(() => Book, book => book.sold)
    soldBooks: Book[];

    @Column({ unique: true, nullable: false})
    email: string;

    @Column({ select: false, nullable: false })
    password: string;

}
