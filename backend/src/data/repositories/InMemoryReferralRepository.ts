import { Referral } from '../../domain/entities/Referral';
import { IReferralRepository } from '../../domain/repositories/IReferralRepository';

export class InMemoryReferralRepository implements IReferralRepository {
    private referrals: Map<string, Referral> = new Map();

    async findById(id: string): Promise<Referral | null> {
        return this.referrals.get(id) || null;
    }

    async findAll(): Promise<Referral[]> {
        return Array.from(this.referrals.values());
    }

    async save(entity: Referral): Promise<Referral> {
        this.referrals.set(entity.getId(), entity);
        return entity;
    }

    async update(id: string, entity: Referral): Promise<Referral | null> {
        if (!this.referrals.has(id)) return null;
        this.referrals.set(id, entity);
        return entity;
    }

    async delete(id: string): Promise<boolean> {
        return this.referrals.delete(id);
    }

    async findByApplicationId(applicationId: string): Promise<Referral | null> {
        for (const ref of this.referrals.values()) {
            if (ref.getApplicationId() === applicationId) {
                return ref;
            }
        }
        return null;
    }
}
