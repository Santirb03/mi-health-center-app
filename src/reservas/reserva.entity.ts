import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Consultorio } from '../consultorios/consultorio.entity';
import { Pago } from '../pagos/pago.entity';

export enum ReservaStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    CANCELLED = 'cancelled',
    COMPLETED = 'completed',
}

@Entity('bookings')
export class Reserva {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.reservas, { eager: true })
    @JoinColumn()
    user: User;

    @ManyToOne(() => Consultorio, (consultorio) => consultorio.reservas, { eager: true })
    @JoinColumn()
    consultorio: Consultorio;

    @Column({ type: 'timestamp' })
    startTime: Date;

    @Column({ type: 'timestamp' })
    endTime: Date;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    totalPrice: number;

    @Column({ type: 'enum', enum: ReservaStatus, default: ReservaStatus.PENDING })
    status: ReservaStatus;

    @Column({ nullable: true })
    notes: string;

    @OneToOne(() => Pago, (pago) => pago.reserva)
    pago: Pago;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
