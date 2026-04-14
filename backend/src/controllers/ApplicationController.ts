import { Request, Response } from 'express';
import { ApplicationService } from '../services/ApplicationService';
import { ReferralService } from '../services/ReferralService';

export class ApplicationController {
    private applicationService: ApplicationService;
    private referralService: ReferralService;

    constructor(applicationService: ApplicationService, referralService: ReferralService) {
        this.applicationService = applicationService;
        this.referralService = referralService;
    }

    public applyForJob = async (req: Request, res: Response) => {
        try {
            const { studentId, jobId } = req.body;
            const application = await this.applicationService.applyForJob(studentId, jobId);
            
            // Generate referral request seamlessly as per use case diagram UC6 includes UC7
            const referral = await this.referralService.createReferral(application.getId());

            res.status(201).json({ application, referral });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    public approveReferral = async (req: Request, res: Response) => {
        try {
            const referralId = req.params.referralId as string;
            const referral = await this.referralService.approveReferral(referralId);
            res.status(200).json(referral);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    public getAlumniApplications = async (req: Request, res: Response) => {
        try {
            const alumniId = req.params.alumniId as string;
            const applications = await this.applicationService.getApplicationsForAlumni(alumniId);
            res.status(200).json(applications);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    public getStudentApplications = async (req: Request, res: Response) => {
        try {
            const studentId = req.params.studentId as string;
            const applications = await this.applicationService.getApplicationsForStudent(studentId);
            res.status(200).json(applications);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
