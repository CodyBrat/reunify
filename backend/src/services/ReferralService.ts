import { v4 as uuidv4 } from 'uuid';
import { IReferralRepository } from '../domain/repositories/IReferralRepository';
import { IApplicationRepository } from '../domain/repositories/IApplicationRepository';
import { Referral } from '../domain/entities/Referral';

export class ReferralService {
    private referralRepository: IReferralRepository;
    private applicationRepository: IApplicationRepository;

    constructor(referralRepository: IReferralRepository, applicationRepository: IApplicationRepository) {
        this.referralRepository = referralRepository;
        this.applicationRepository = applicationRepository;
    }

    async createReferral(applicationId: string): Promise<Referral> {
        const application = await this.applicationRepository.findById(applicationId);
        if (!application) throw new Error('Application not found');

        const existing = await this.referralRepository.findByApplicationId(applicationId);
        if (existing) throw new Error('Referral already requested for this application');

        const referral = new Referral(uuidv4(), applicationId);
        return await this.referralRepository.save(referral);
    }

    /** Student fills in the multi-step context form */
    async enrichReferral(referralId: string, data: {
        whyThisRole?: string;
        relevantSkills?: string[];
        expectedSalary?: string;
        applicationTimeline?: string;
        studentQuestions?: string;
    }): Promise<Referral> {
        const referral = await this.referralRepository.findById(referralId);
        if (!referral) throw new Error('Referral not found');

        referral.enrich(data);
        return await this.referralRepository.update(referral.getId(), referral) as Referral;
    }

    async approveReferral(referralId: string): Promise<Referral> {
        const referral = await this.referralRepository.findById(referralId);
        if (!referral) throw new Error('Referral not found');

        referral.approve();
        await this.referralRepository.update(referral.getId(), referral);

        const app = await this.applicationRepository.findById(referral.getApplicationId());
        if (app) {
            app.updateStatus('Reviewing');
            await this.applicationRepository.update(app.getId(), app);
        }

        return referral;
    }

    async declineReferral(referralId: string, reason: string): Promise<Referral> {
        const referral = await this.referralRepository.findById(referralId);
        if (!referral) throw new Error('Referral not found');

        referral.decline(reason);
        return await this.referralRepository.update(referral.getId(), referral) as Referral;
    }

    async requestChanges(referralId: string, message: string): Promise<Referral> {
        const referral = await this.referralRepository.findById(referralId);
        if (!referral) throw new Error('Referral not found');

        referral.requestChanges(message);
        return await this.referralRepository.update(referral.getId(), referral) as Referral;
    }

    async updateStudentStatus(referralId: string, status: string): Promise<Referral> {
        const referral = await this.referralRepository.findById(referralId);
        if (!referral) throw new Error('Referral not found');

        if (status === 'Interview Scheduled') referral.scheduleInterview();
        else if (status === 'Offer Received') referral.markOfferReceived();
        else if (status === 'Withdrawn') referral.withdraw();
        else if (status === 'Referral Submitted') referral.markSubmittedToCompany();
        else throw new Error(`Status "${status}" cannot be set via this endpoint`);

        return await this.referralRepository.update(referral.getId(), referral) as Referral;
    }

    async markUnderReview(referralId: string): Promise<Referral> {
        const referral = await this.referralRepository.findById(referralId);
        if (!referral) throw new Error('Referral not found');
        referral.setUnderReview();
        return await this.referralRepository.update(referral.getId(), referral) as Referral;
    }

    async rejectReferral(referralId: string): Promise<Referral> {
        const referral = await this.referralRepository.findById(referralId);
        if (!referral) throw new Error('Referral not found');
        referral.reject();
        return await this.referralRepository.update(referral.getId(), referral) as Referral;
    }
}
