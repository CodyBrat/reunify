import { IReferralRepository } from '../../domain/repositories/IReferralRepository';
import { Referral } from '../../domain/entities/Referral';
import { prisma } from '../prisma.client';

export class PrismaReferralRepository implements IReferralRepository {
    async findById(id: string): Promise<Referral | null> {
        const data = await prisma.referral.findUnique({ where: { id } });
        return data ? new Referral(data.id, data.applicationId, data.status as any, data.decisionDate) : null;
    }

    async findAll(): Promise<Referral[]> {
        const data = await prisma.referral.findMany();
        return data.map(d => new Referral(d.id, d.applicationId, d.status as any, d.decisionDate));
    }

    async findByApplicationId(applicationId: string): Promise<Referral | null> {
        const data = await prisma.referral.findUnique({ where: { applicationId } });
        return data ? new Referral(data.id, data.applicationId, data.status as any, data.decisionDate) : null;
    }

    async save(entity: Referral): Promise<Referral> {
        const id = entity.getId();
        const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);

        let existing = null;
        if (isMongoId) {
            existing = await prisma.referral.findUnique({ where: { id } });
        }

        if (existing) {
            const data = await prisma.referral.update({
                where: { id },
                data: { status: entity.getStatus(), decisionDate: entity.getDecisionDate() }
            });
            return new Referral(data.id, data.applicationId, data.status as any, data.decisionDate);
        } else {
            const data = await prisma.referral.create({
                data: {
                    applicationId: entity.getApplicationId(),
                    status: entity.getStatus(),
                    decisionDate: entity.getDecisionDate()
                }
            });
            return new Referral(data.id, data.applicationId, data.status as any, data.decisionDate);
        }
    }

    async update(id: string, entity: Referral): Promise<Referral | null> {
        return this.save(entity);
    }

    async delete(id: string): Promise<boolean> {
        await prisma.referral.delete({ where: { id }});
        return true;
    }
}
