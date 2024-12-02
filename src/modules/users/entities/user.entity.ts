import { Shortener } from "../../shortener/entities/shortener.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id:number;

    @Column({unique:true})
    email:string;

    @Column()
    name:string;

    @Column()
    password:string;

    @OneToMany(() => Shortener, (shortener) => shortener.id)
    shorteners: Shortener[];

}
