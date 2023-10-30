import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AuthorDTO } from "../../../models";

@Entity()
export class Author implements AuthorDTO
{
    @PrimaryGeneratedColumn()
    id: number;
    @Column({nullable: false, type: "text"})
    name: string;
    @Column({nullable: false, type: "text"})
    biography: string;
}