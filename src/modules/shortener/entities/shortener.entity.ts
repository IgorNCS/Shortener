import { User } from "../../users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Shortener {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    originalURL:string;

    @Column({unique:true})
    shortenerURL:string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user_id: User;

    @Column()
    clicks:number;

    @CreateDateColumn({ type: 'timestamp', precision: 6, default: () => 'CURRENT_TIMESTAMP(6)' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', precision: 6, default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
    updatedAt: Date;
}
