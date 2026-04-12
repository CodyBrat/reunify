import { Application } from '../../domain/entities/Application';
import { IApplicationRepository } from '../../domain/repositories/IApplicationRepository';

export class InMemoryApplicationRepository implements IApplicationRepository {
    private applications: Map<string, Application> = new Map();

    async findById(id: string): Promise<Application | null> {
        return this.applications.get(id) || null;
    }

    async findAll(): Promise<Application[]> {
        return Array.from(this.applications.values());
    }

    async save(entity: Application): Promise<Application> {
        this.applications.set(entity.getId(), entity);
        return entity;
    }

    async update(id: string, entity: Application): Promise<Application | null> {
        if (!this.applications.has(id)) return null;
        this.applications.set(id, entity);
        return entity;
    }

    async delete(id: string): Promise<boolean> {
        return this.applications.delete(id);
    }

    async findByStudentId(studentId: string): Promise<Application[]> {
        return Array.from(this.applications.values()).filter(app => app.getStudentId() === studentId);
    }

    async findByJobId(jobId: string): Promise<Application[]> {
        return Array.from(this.applications.values()).filter(app => app.getJobId() === jobId);
    }

    async findByAlumniId(alumniId: string): Promise<Application[]> {
        // Simple filter for in-memory
        return Array.from(this.applications.values());
    }
}
