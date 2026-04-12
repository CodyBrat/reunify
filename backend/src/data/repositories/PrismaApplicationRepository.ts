import { IApplicationRepository } from '../../domain/repositories/IApplicationRepository';
import { Application } from '../../domain/entities/Application';
import { prisma } from '../prisma.client';

export class PrismaApplicationRepository implements IApplicationRepository {
    async findById(id: string): Promise<Application | null> {
        const data = await prisma.application.findUnique({ where: { id } });
        return data ? new Application(data.id, data.studentId, data.jobId, data.status as any, data.appliedAt) : null;
    }

    async findAll(): Promise<Application[]> {
        const data = await prisma.application.findMany();
        return data.map(d => new Application(d.id, d.studentId, d.jobId, d.status as any, d.appliedAt));
    }

    async findByStudentId(studentId: string): Promise<Application[]> {
        const data = await prisma.application.findMany({ where: { studentId } });
        return data.map(d => new Application(d.id, d.studentId, d.jobId, d.status as any, d.appliedAt));
    }

    async findByJobId(jobId: string): Promise<Application[]> {
        const data = await prisma.application.findMany({ where: { jobId } });
        return data.map(d => new Application(d.id, d.studentId, d.jobId, d.status as any, d.appliedAt));
    }

    async findByAlumniId(alumniId: string): Promise<any[]> {
        const data = await prisma.application.findMany({
            where: {
                job: { alumniId }
            },
            include: {
                student: true,
                job: true,
                referral: true
            },
            orderBy: { appliedAt: 'desc' }
        });
        return data; // Returning raw Prisma data here for rich dashboard info
    }

    async save(entity: Application): Promise<Application> {
        const id = entity.getId();
        const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);

        let existing = null;
        if (isMongoId) {
            existing = await prisma.application.findUnique({ where: { id } });
        }

        if (existing) {
            const data = await prisma.application.update({
                where: { id },
                data: { status: entity.getStatus() }
            });
            return new Application(data.id, data.studentId, data.jobId, data.status as any, data.appliedAt);
        } else {
            const data = await prisma.application.create({
                data: {
                    studentId: entity.getStudentId(),
                    jobId: entity.getJobId(),
                    status: entity.getStatus(),
                    appliedAt: entity.getAppliedAt()
                }
            });
            return new Application(data.id, data.studentId, data.jobId, data.status as any, data.appliedAt);
        }
    }

    async update(id: string, entity: Application): Promise<Application | null> {
        return this.save(entity);
    }

    async delete(id: string): Promise<boolean> {
        await prisma.application.delete({ where: { id }});
        return true;
    }
}
