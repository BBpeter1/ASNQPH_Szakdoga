import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { CategoryDTO } from "../../../models";

@Entity()
export class Category implements CategoryDTO
{
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    title: string;
}