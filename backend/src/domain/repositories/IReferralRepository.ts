import { Referral } from '../entities/Referral';
import { IRepository } from './IRepository';

export interface IReferralRepository extends IRepository<Referral> {
    findByApplicationId(applicationId: string): Promise<Referral | null>;
}
