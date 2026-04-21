import { Application } from '../entities/Application';
import { IRepository } from './IRepository';

export interface IApplicationRepository extends IRepository<Application> {
    findByStudentId(studentId: string): Promise<Application[]>;
    findByJobId(jobId: string): Promise<Application[]>;
    findByAlumniId(alumniId: string): Promise<Application[]>;
}
