import { Injectable, NotFoundException } from '@nestjs/common';
import { ConsultorioStatus, ReservaStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CrearConsultorioDto } from './dto/crear-consultorio.dto';
import { DisponibilidadQueryDto } from './dto/disponibilidad-query.dto';

export interface SlotHorario {
    startTime: Date;
    endTime: Date;
    available: boolean;
}

// Horario de atención del coworking médico
const BUSINESS_START_HOUR = 7;  // 07:00
const BUSINESS_END_HOUR = 21;   // 21:00

@Injectable()
export class ConsultoriosService {
    constructor(private readonly prisma: PrismaService) { }

    create(crearConsultorioDto: CrearConsultorioDto) {
        return this.prisma.consultorio.create({ data: crearConsultorioDto });
    }

    findAll() {
        return this.prisma.consultorio.findMany();
    }

    findDisponibles() {
        return this.prisma.consultorio.findMany({ where: { status: ConsultorioStatus.available } });
    }

    /**
     * Devuelve todos los consultorios disponibles (status=available)
     * que NO tengan reservas activas que se solapen con el rango dado.
     */
    async findDisponiblesEnRango(query: DisponibilidadQueryDto) {
        const start = new Date(query.startTime);
        const end = new Date(query.endTime);

        const conflicting = await this.prisma.reserva.findMany({
            where: {
                status: { not: ReservaStatus.cancelled },
                startTime: { lt: end },
                endTime: { gt: start },
            },
            select: { consultorioId: true },
        });

        const conflictIds = conflicting.map((r) => r.consultorioId);

        return this.prisma.consultorio.findMany({
            where: {
                status: ConsultorioStatus.available,
                ...(conflictIds.length > 0 ? { id: { notIn: conflictIds } } : {}),
            },
        });
    }

    /**
     * Devuelve los slots horarios (1 h cada uno) para un consultorio
     * en la fecha indicada (YYYY-MM-DD), marcando cuáles están libres.
     */
    async getSlotsDelConsultorio(id: string, date: string): Promise<SlotHorario[]> {
        await this.findOne(id);

        const dayStart = new Date(`${date}T00:00:00.000Z`);
        const dayEnd = new Date(`${date}T23:59:59.999Z`);

        const reservas = await this.prisma.reserva.findMany({
            where: {
                consultorioId: id,
                status: { not: ReservaStatus.cancelled },
                startTime: { lt: dayEnd },
                endTime: { gt: dayStart },
            },
        });

        const slots: SlotHorario[] = [];

        for (let hour = BUSINESS_START_HOUR; hour < BUSINESS_END_HOUR; hour++) {
            const slotStart = new Date(`${date}T${String(hour).padStart(2, '0')}:00:00.000Z`);
            const slotEnd = new Date(`${date}T${String(hour + 1).padStart(2, '0')}:00:00.000Z`);

            const ocupado = reservas.some((r) => r.startTime < slotEnd && r.endTime > slotStart);
            slots.push({ startTime: slotStart, endTime: slotEnd, available: !ocupado });
        }

        return slots;
    }

    async findOne(id: string) {
        const consultorio = await this.prisma.consultorio.findUnique({ where: { id } });
        if (!consultorio) throw new NotFoundException(`Consultorio ${id} no encontrado`);
        return consultorio;
    }

    async update(id: string, updateData: Partial<CrearConsultorioDto>) {
        await this.findOne(id);
        return this.prisma.consultorio.update({ where: { id }, data: updateData });
    }

    async remove(id: string) {
        await this.findOne(id);
        await this.prisma.consultorio.delete({ where: { id } });
    }
}
