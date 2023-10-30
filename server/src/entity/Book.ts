import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BookDTO} from '../../../models';
import { User } from './User';

@Entity()
export class Book implements BookDTO {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true, type: 'text'})
    title: string;

    @Column({nullable: true})
    price: number

    @Column({nullable: true, type: 'text'})
    category: string;

    @Column({nullable: true, type: 'text' })
    description: string;

    @Column({nullable: true, type: 'text' })
    Author: string;

    @Column({nullable: true, type: 'date' })
    date: string;

    @Column({nullable: true, type: 'date' })
    borrowDate: string;

    @Column({nullable: true, type: 'date' })
    soldDate: string;

    @Column({nullable: true, type: 'text' })
    status: string;

    @ManyToOne(() => User, user => user.borrowedBooks, {eager:true})
    borrower: User;

    @ManyToOne(() => User, user => user.soldBooks, {eager:true})
    sold: User;

    @Column()
    delay: number

}