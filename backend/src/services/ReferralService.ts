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

    async approveReferral(referralId: string): Promise<Referral> {
        const referral = await this.referralRepository.findById(referralId);
        if (!referral) throw new Error('Referral not found');

        referral.approve();
        await this.referralRepository.update(referral.getId(), referral);

        // Update application status
        const app = await this.applicationRepository.findById(referral.getApplicationId());
        if (app) {
            app.updateStatus('Reviewing'); // Or any logic
            await this.applicationRepository.update(app.getId(), app);
        }

        return referral;
    }

    async rejectReferral(referralId: string): Promise<Referral> {
        const referral = await this.referralRepository.findById(referralId);
        if (!referral) throw new Error('Referral not found');

        referral.reject();
        await this.referralRepository.update(referral.getId(), referral);
        
        return referral;
    }
}
