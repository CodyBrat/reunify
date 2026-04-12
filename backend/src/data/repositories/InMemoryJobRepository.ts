import { Job } from '../../domain/entities/Job';
import { IJobRepository } from '../../domain/repositories/IJobRepository';

export class InMemoryJobRepository implements IJobRepository {
    private jobs: Map<string, Job> = new Map();

    async findById(id: string): Promise<Job | null> {
        return this.jobs.get(id) || null;
    }

    async findAll(): Promise<Job[]> {
        return Array.from(this.jobs.values());
    }

    async save(entity: Job): Promise<Job> {
        this.jobs.set(entity.getId(), entity);
        return entity;
    }

    async update(id: string, entity: Job): Promise<Job | null> {
        if (!this.jobs.has(id)) return null;
        this.jobs.set(id, entity);
        return entity;
    }

    async delete(id: string): Promise<boolean> {
        return this.jobs.delete(id);
    }

    async findByAlumniId(alumniId: string): Promise<Job[]> {
        return Array.from(this.jobs.values()).filter(job => job.getAlumniId() === alumniId);
    }

    async findOpenJobs(): Promise<Job[]> {
        return Array.from(this.jobs.values()).filter(job => job.getStatus() === 'Open');
    }
}
