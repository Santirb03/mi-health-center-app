import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { Reserva } from '../reservas/reserva.entity';

export enum PagoStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    FAILED = 'failed',
    REFUNDED = 'refunded',
}

export enum MetodoPago {
    CREDIT_CARD = 'credit_card',
    DEBIT_CARD = 'debit_card',
    TRANSFER = 'transfer',
    CASH = 'cash',
}

@Entity('payments')
export class Pago {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => Reserva, (reserva) => reserva.pago)
    @JoinColumn()
    reserva: Reserva;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @Column({ type: 'enum', enum: PagoStatus, default: PagoStatus.PENDING })
    status: PagoStatus;

    @Column({ type: 'enum', enum: MetodoPago })
    method: MetodoPago;

    @Column({ nullable: true })
    transactionId: string;

    @Column({ nullable: true })
    notes: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
