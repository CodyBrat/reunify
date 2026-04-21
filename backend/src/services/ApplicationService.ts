import { v4 as uuidv4 } from 'uuid';
import { IApplicationRepository } from '../domain/repositories/IApplicationRepository';
import { IJobRepository } from '../domain/repositories/IJobRepository';
import { Application } from '../domain/entities/Application';

export class ApplicationService {
    private applicationRepository: IApplicationRepository;
    private jobRepository: IJobRepository;

    constructor(applicationRepository: IApplicationRepository, jobRepository: IJobRepository) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
    }

    async applyForJob(studentId: string, jobId: string): Promise<Application> {
        const job = await this.jobRepository.findById(jobId);
        if (!job) throw new Error('Job not found');
        if (job.getStatus() !== 'Open') throw new Error('Job is no longer open');

        const existingApps = await this.applicationRepository.findByStudentId(studentId);
        if (existingApps.some(app => app.getJobId() === jobId)) {
            throw new Error('Student has already applied for this job');
        }

        const application = new Application(uuidv4(), studentId, jobId);
        return await this.applicationRepository.save(application);
    }

    async getApplicationsForStudent(studentId: string): Promise<Application[]> {
        return await this.applicationRepository.findByStudentId(studentId);
    }

    async getApplicationsForJob(jobId: string): Promise<Application[]> {
        return await this.applicationRepository.findByJobId(jobId);
    }

    async getApplicationsForAlumni(alumniId: string): Promise<Application[]> {
        return await this.applicationRepository.findByAlumniId(alumniId);
    }
}
