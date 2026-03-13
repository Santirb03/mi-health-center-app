# Salux Backend

## Stack
- NestJS
- Prisma
- PostgreSQL 17
- Docker (dev)
- Railway (prod)

## Arquitectura
- Modular architecture (feature-based)
- Each module has controller, service, module
- PrismaService is global
- No business logic in controllers

## Módulos principales
- Auth
- Users
- Doctors
- Consultorios
- Reservations
- Patients

## Reglas
- All endpoints under /api/v1
- Use DTOs for validation
- Use Prisma as ORM