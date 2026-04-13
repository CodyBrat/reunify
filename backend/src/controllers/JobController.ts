import { Request, Response } from 'express';
import { JobService } from '../services/JobService';

export class JobController {
    private jobService: JobService;

    constructor(jobService: JobService) {
        this.jobService = jobService;
    }

    public postJob = async (req: Request, res: Response) => {
        try {
            // Assume req.user is set by auth middleware, for now read from body or assume alumniId
            const { alumniId, title, description, deadline } = req.body;
            const job = await this.jobService.postJob(alumniId, title, description, new Date(deadline));
            res.status(201).json(job);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    public getOpenJobs = async (req: Request, res: Response) => {
        try {
            const jobs = await this.jobService.getOpenJobs();
            res.status(200).json(jobs);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    public getAlumniJobs = async (req: Request, res: Response) => {
        try {
            const { alumniId } = req.params;
            const jobs = await this.jobService.getJobsByAlumni(alumniId as string);
            res.status(200).json(jobs);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
