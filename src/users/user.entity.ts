import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { Reserva } from '../reservas/reserva.entity';

export enum UserRole {
    DOCTOR = 'doctor',
    ADMIN = 'admin',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    specialty: string;

    @Column({ nullable: true })
    licenseNumber: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.DOCTOR })
    role: UserRole;

    @Column({ default: true })
    isActive: boolean;

    @OneToMany(() => Reserva, (reserva) => reserva.user)
    reservas: Reserva[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
