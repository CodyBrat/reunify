import { IJobRepository } from '../../domain/repositories/IJobRepository';
import { Job } from '../../domain/entities/Job';
import { prisma } from '../prisma.client';

export class PrismaJobRepository implements IJobRepository {
    async findById(id: string): Promise<Job | null> {
        const data = await prisma.job.findUnique({ where: { id } });
        return data ? new Job(data.id, data.alumniId, data.title, data.description, data.deadline, data.status as any, data.createdAt) : null;
    }

    async findAll(): Promise<Job[]> {
        const data = await prisma.job.findMany();
        return data.map(d => new Job(d.id, d.alumniId, d.title, d.description, d.deadline, d.status as any, d.createdAt));
    }

    async findOpenJobs(): Promise<Job[]> {
        const data = await prisma.job.findMany({ where: { status: 'Open' } });
        return data.map(d => new Job(d.id, d.alumniId, d.title, d.description, d.deadline, d.status as any, d.createdAt));
    }

    async findByAlumniId(alumniId: string): Promise<Job[]> {
        const data = await prisma.job.findMany({ where: { alumniId } });
        return data.map(d => new Job(d.id, d.alumniId, d.title, d.description, d.deadline, d.status as any, d.createdAt));
    }

    async save(entity: Job): Promise<Job> {
        const id = entity.getId();
        const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);

        let existing = null;
        if (isMongoId) {
            existing = await prisma.job.findUnique({ where: { id } });
        }

        if (existing) {
            const data = await prisma.job.update({
                where: { id },
                data: { title: entity.getTitle(), description: entity.getDescription(), status: entity.getStatus(), deadline: entity.getDeadline() }
            });
            return new Job(data.id, data.alumniId, data.title, data.description, data.deadline, data.status as any, data.createdAt);
        } else {
            const data = await prisma.job.create({
                data: {
                    alumniId: entity.getAlumniId(),
                    title: entity.getTitle(),
                    description: entity.getDescription(),
                    deadline: entity.getDeadline(),
                    status: entity.getStatus(),
                    createdAt: entity.getCreatedAt()
                }
            });
            return new Job(data.id, data.alumniId, data.title, data.description, data.deadline, data.status as any, data.createdAt);
        }
    }

    async update(id: string, entity: Job): Promise<Job | null> {
        return this.save(entity);
    }

    async delete(id: string): Promise<boolean> {
        await prisma.job.delete({ where: { id }});
        return true;
    }
}
