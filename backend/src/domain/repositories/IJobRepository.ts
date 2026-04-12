import { Job } from '../entities/Job';
import { IRepository } from './IRepository';

export interface IJobRepository extends IRepository<Job> {
    findByAlumniId(alumniId: string): Promise<Job[]>;
    findOpenJobs(): Promise<Job[]>;
}
