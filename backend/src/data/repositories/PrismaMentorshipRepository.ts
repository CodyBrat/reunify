import { IMentorshipRepository } from '../../domain/repositories/IMentorshipRepository';
import { Mentorship } from '../../domain/entities/Mentorship';
import { prisma } from '../prisma.client';

export class PrismaMentorshipRepository implements IMentorshipRepository {
    async findById(id: string): Promise<Mentorship | null> {
        const data = await prisma.mentorship.findUnique({
            where: { id },
            include: { 
                student: { select: { name: true } },
                alumni: { select: { name: true } }
            }
        });
        return data ? new Mentorship(data.id, data.studentId, data.alumniId, data.message, data.status, data.createdAt, data.student?.name, data.alumni?.name) : null;
    }

    async findAll(): Promise<Mentorship[]> {
        const data = await prisma.mentorship.findMany({
            include: { 
                student: { select: { name: true } },
                alumni: { select: { name: true } }
            }
        });
        return data.map(d => new Mentorship(d.id, d.studentId, d.alumniId, d.message, d.status, d.createdAt, d.student?.name, d.alumni?.name));
    }

    async findByStudentId(studentId: string): Promise<Mentorship[]> {
        const data = await prisma.mentorship.findMany({
            where: { studentId },
            include: { alumni: { select: { name: true } } }
        });
        return data.map(d => new Mentorship(d.id, d.studentId, d.alumniId, d.message, d.status, d.createdAt, undefined, d.alumni?.name));
    }

    async findByAlumniId(alumniId: string): Promise<Mentorship[]> {
        const data = await prisma.mentorship.findMany({
            where: { alumniId },
            include: { student: { select: { name: true } } }
        });
        return data.map(d => new Mentorship(d.id, d.studentId, d.alumniId, d.message, d.status, d.createdAt, d.student?.name));
    }

    async save(entity: Mentorship): Promise<Mentorship> {
        const id = entity.getId();
        const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);

        let existing = null;
        if (isMongoId) {
            existing = await prisma.mentorship.findUnique({ where: { id } });
        }

        if (existing) {
            const data = await prisma.mentorship.update({
                where: { id },
                data: { status: entity.getStatus() }
            });
            return new Mentorship(data.id, data.studentId, data.alumniId, data.message, data.status, data.createdAt);
        } else {
            const data = await prisma.mentorship.create({
                data: {
                    studentId: entity.getStudentId(),
                    alumniId: entity.getAlumniId(),
                    message: entity.getMessage(),
                    status: entity.getStatus(),
                    createdAt: entity.getCreatedAt()
                }
            });
            return new Mentorship(data.id, data.studentId, data.alumniId, data.message, data.status, data.createdAt);
        }
    }

    async update(id: string, entity: Mentorship): Promise<Mentorship | null> {
        return this.save(entity);
    }

    async delete(id: string): Promise<boolean> {
        await prisma.mentorship.delete({ where: { id } });
        return true;
    }
}
