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
            const referral = await this.referralService.createReferral(application.getId());
            res.status(201).json({ application, referral });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    /** Student fills in multi-step context: whyThisRole, skills, salary, timeline */
    public enrichReferral = async (req: Request, res: Response) => {
        try {
            const referralId = req.params.referralId as string;
            const { whyThisRole, relevantSkills, expectedSalary, applicationTimeline, studentQuestions } = req.body;
            const referral = await this.referralService.enrichReferral(referralId, {
                whyThisRole,
                relevantSkills,
                expectedSalary,
                applicationTimeline,
                studentQuestions,
            });
            res.status(200).json(referral);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    /** Alumni views request — marks it as Under Review */
    public markUnderReview = async (req: Request, res: Response) => {
        try {
            const referralId = req.params.referralId as string;
            const referral = await this.referralService.markUnderReview(referralId);
            res.status(200).json(referral);
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

    /** Alumni declines with a reason */
    public declineReferral = async (req: Request, res: Response) => {
        try {
            const referralId = req.params.referralId as string;
            const { reason } = req.body;
            if (!reason) return res.status(400).json({ error: 'Decline reason is required' });
            const referral = await this.referralService.declineReferral(referralId, reason);
            res.status(200).json(referral);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    /** Alumni requests changes from student */
    public requestChanges = async (req: Request, res: Response) => {
        try {
            const referralId = req.params.referralId as string;
            const { message } = req.body;
            if (!message) return res.status(400).json({ error: 'Message is required' });
            const referral = await this.referralService.requestChanges(referralId, message);
            res.status(200).json(referral);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    /** Student updates outcome status (Interview Scheduled, Offer Received, Withdrawn) */
    public updateStudentStatus = async (req: Request, res: Response) => {
        try {
            const referralId = req.params.referralId as string;
            const { status } = req.body;
            if (!status) return res.status(400).json({ error: 'Status is required' });
            const referral = await this.referralService.updateStudentStatus(referralId, status);
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
