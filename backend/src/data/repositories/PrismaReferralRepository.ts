import { IReferralRepository } from '../../domain/repositories/IReferralRepository';
import { Referral, ReferralStatus } from '../../domain/entities/Referral';
import { prisma } from '../prisma.client';

function toEntity(data: any): Referral {
    return new Referral(
        data.id,
        data.applicationId,
        data.status as ReferralStatus,
        data.decisionDate ?? null,
        data.whyThisRole ?? '',
        data.relevantSkills ?? [],
        data.expectedSalary ?? '',
        data.applicationTimeline ?? '',
        data.studentQuestions ?? '',
        data.declineReason ?? '',
        data.changesRequested ?? '',
        data.approvedAt ?? null,
        data.submittedToCompanyAt ?? null,
        data.interviewScheduledAt ?? null,
        data.offerReceivedAt ?? null,
    );
}

export class PrismaReferralRepository implements IReferralRepository {
    async findById(id: string): Promise<Referral | null> {
        const data = await prisma.referral.findUnique({ where: { id } });
        return data ? toEntity(data) : null;
    }

    async findAll(): Promise<Referral[]> {
        const data = await prisma.referral.findMany();
        return data.map(toEntity);
    }

    async findByApplicationId(applicationId: string): Promise<Referral | null> {
        const data = await prisma.referral.findUnique({ where: { applicationId } });
        return data ? toEntity(data) : null;
    }

    async save(entity: Referral): Promise<Referral> {
        const payload = {
            status: entity.getStatus(),
            decisionDate: entity.getDecisionDate(),
            whyThisRole: entity.getWhyThisRole(),
            relevantSkills: entity.getRelevantSkills(),
            expectedSalary: entity.getExpectedSalary(),
            applicationTimeline: entity.getApplicationTimeline(),
            studentQuestions: entity.getStudentQuestions(),
            declineReason: entity.getDeclineReason(),
            changesRequested: entity.getChangesRequested(),
            approvedAt: entity.getApprovedAt(),
            submittedToCompanyAt: entity.getSubmittedToCompanyAt(),
            interviewScheduledAt: entity.getInterviewScheduledAt(),
            offerReceivedAt: entity.getOfferReceivedAt(),
            updatedAt: new Date(),
        };

        const id = entity.getId();
        const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);
        let existing = null;
        if (isMongoId) {
            existing = await prisma.referral.findUnique({ where: { id } });
        }

        if (existing) {
            const data = await prisma.referral.update({ where: { id }, data: payload });
            return toEntity(data);
        } else {
            const data = await prisma.referral.create({
                data: { applicationId: entity.getApplicationId(), ...payload }
            });
            return toEntity(data);
        }
    }

    async update(id: string, entity: Referral): Promise<Referral | null> {
        return this.save(entity);
    }

    async delete(id: string): Promise<boolean> {
        await prisma.referral.delete({ where: { id } });
        return true;
    }
}
