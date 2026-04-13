import { v4 as uuidv4 } from 'uuid';
import { IJobRepository } from '../domain/repositories/IJobRepository';
import { Job } from '../domain/entities/Job';

export class JobService {
    private jobRepository: IJobRepository;

    constructor(jobRepository: IJobRepository) {
        this.jobRepository = jobRepository;
    }

    async postJob(alumniId: string, title: string, description: string, deadline: Date): Promise<Job> {
        const job = new Job(uuidv4(), alumniId, title, description, deadline);
        return await this.jobRepository.save(job);
    }

    async getOpenJobs(): Promise<Job[]> {
        return await this.jobRepository.findOpenJobs();
    }

    async getJobById(id: string): Promise<Job | null> {
        return await this.jobRepository.findById(id);
    }

    async getJobsByAlumni(alumniId: string): Promise<Job[]> {
        return await this.jobRepository.findByAlumniId(alumniId);
    }
}
