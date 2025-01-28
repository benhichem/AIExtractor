import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Account {
    @PrimaryGeneratedColumn()
    id!: number;


    @Column()
    username!: string

    @Column()
    password!: string

    @Column()
    apiKey!: string

    // Add this new column
    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;
}