import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PagoStatus, ReservaStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CrearPagoDto } from './dto/crear-pago.dto';

@Injectable()
export class PagosService {
    constructor(private readonly prisma: PrismaService) { }

    async create(crearPagoDto: CrearPagoDto) {
        const { reservaId, method, transactionId, notes } = crearPagoDto;

        const reserva = await this.prisma.reserva.findUnique({
            where: { id: reservaId },
            include: { pago: true },
        });
        if (!reserva) throw new NotFoundException(`Reserva ${reservaId} no encontrada`);
        if (reserva.pago) throw new BadRequestException('Esta reserva ya tiene un pago registrado');

        const pago = await this.prisma.pago.create({
            data: {
                reservaId,
                amount: reserva.totalPrice,
                method,
                status: PagoStatus.completed,
                transactionId,
                notes,
            },
            include: { reserva: true },
        });

        await this.prisma.reserva.update({
            where: { id: reservaId },
            data: { status: ReservaStatus.confirmed },
        });

        return pago;
    }

    findAll() {
        return this.prisma.pago.findMany({ include: { reserva: true } });
    }

    async findOne(id: string) {
        const pago = await this.prisma.pago.findUnique({
            where: { id },
            include: { reserva: true },
        });
        if (!pago) throw new NotFoundException(`Pago ${id} no encontrado`);
        return pago;
    }

    async refund(id: string) {
        await this.findOne(id);
        return this.prisma.pago.update({ where: { id }, data: { status: PagoStatus.refunded } });
    }
}
