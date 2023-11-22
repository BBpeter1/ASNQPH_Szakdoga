import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BookDTO} from '../../../models';
import { User } from './User';

@Entity()
export class Book implements BookDTO {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false, type: 'text'})
    title: string;

    @Column({nullable: false})
    price: number

    @Column({nullable: false, type: 'text'})
    category: string;

    @Column({nullable: false, type: 'text' })
    description: string;

    @Column({nullable: false, type: 'text' })
    Author: string;

    @Column({nullable: false, type: 'date' })
    date: string;

    @Column({nullable: true, type: 'date' })
    borrowDate: string;

    @Column({nullable: true, type: 'date' })
    soldDate: string;

    @Column({nullable: false, type: 'text' })
    status: string;

    @ManyToOne(() => User, user => user.borrowedBooks, {eager:true})
    borrower: User;

    @ManyToOne(() => User, user => user.soldBooks, {eager:true})
    sold: User;

    @Column()
    delay: number

}