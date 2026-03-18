import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { Reserva } from '../reservas/reserva.entity';

export enum ConsultorioStatus {
    AVAILABLE = 'available',
    UNAVAILABLE = 'unavailable',
}

@Entity('rooms')
export class Consultorio {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ type: 'int' })
    capacity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    pricePerHour: number;

    @Column({ nullable: true })
    floor: string;

    @Column({ nullable: true })
    roomNumber: string;

    @Column({ type: 'simple-array', nullable: true })
    amenities: string[];

    @Column({ type: 'enum', enum: ConsultorioStatus, default: ConsultorioStatus.AVAILABLE })
    status: ConsultorioStatus;

    @OneToMany(() => Reserva, (reserva) => reserva.consultorio)
    reservas: Reserva[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
