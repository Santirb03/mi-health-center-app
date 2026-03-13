import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { ReservaStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CrearReservaDto } from './dto/crear-reserva.dto';
import { UserRole } from '../users/user.entity';

@Injectable()
export class ReservasService {
    constructor(private readonly prisma: PrismaService) { }

    async create(userId: string, crearReservaDto: CrearReservaDto) {
        const { consultorioId, startTime, endTime, notes } = crearReservaDto;

        const start = new Date(startTime);
        const end = new Date(endTime);

        if (end <= start) throw new BadRequestException('La hora de fin debe ser posterior a la hora de inicio');

        if (start <= new Date()) throw new BadRequestException('La hora de inicio debe ser una fecha futura');

        const startHour = start.getUTCHours();
        const endHour = end.getUTCHours() + (end.getUTCMinutes() > 0 ? 1 : 0);
        if (startHour < 7 || endHour > 21) {
            throw new BadRequestException('Las reservas solo se pueden hacer entre 07:00 y 21:00');
        }

        const consultorio = await this.prisma.consultorio.findUnique({ where: { id: consultorioId } });
        if (!consultorio) throw new NotFoundException(`Consultorio ${consultorioId} no encontrado`);

        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new NotFoundException(`Usuario ${userId} no encontrado`);

        const conflicto = await this.prisma.reserva.findFirst({
            where: {
                consultorioId,
                status: { not: ReservaStatus.cancelled },
                startTime: { lt: end },
                endTime: { gt: start },
            },
        });
        if (conflicto) throw new BadRequestException('El consultorio no está disponible en ese horario');

        const horas = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        const totalPrice = horas * Number(consultorio.pricePerHour);

        return this.prisma.reserva.create({
            data: { userId, consultorioId, startTime: start, endTime: end, totalPrice, notes },
            include: { user: true, consultorio: true },
        });
    }

    async findAll(page: number, limit: number) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.reserva.findMany({ skip, take: limit, include: { user: true, consultorio: true, pago: true }, orderBy: { startTime: 'desc' } }),
            this.prisma.reserva.count(),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    async findByUser(userId: string, page: number, limit: number) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.reserva.findMany({
                skip, take: limit,
                where: { userId },
                include: { consultorio: true, pago: true },
                orderBy: { startTime: 'desc' },
            }),
            this.prisma.reserva.count({ where: { userId } }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    async findOne(id: string) {
        const reserva = await this.prisma.reserva.findUnique({
            where: { id },
            include: { user: true, consultorio: true, pago: true },
        });
        if (!reserva) throw new NotFoundException(`Reserva ${id} no encontrada`);
        return reserva;
    }

    async cancel(id: string, userId: string, userRole: string) {
        const reserva = await this.findOne(id);
        if (userRole !== UserRole.ADMIN && reserva.userId !== userId) {
            throw new ForbiddenException('No tienes permiso para cancelar esta reserva');
        }
        if (reserva.status === ReservaStatus.cancelled) {
            throw new BadRequestException('La reserva ya está cancelada');
        }
        return this.prisma.reserva.update({ where: { id }, data: { status: ReservaStatus.cancelled } });
    }

    async confirm(id: string) {
        await this.findOne(id);
        return this.prisma.reserva.update({ where: { id }, data: { status: ReservaStatus.confirmed } });
    }
}
