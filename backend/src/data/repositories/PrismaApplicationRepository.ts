import { IApplicationRepository } from '../../domain/repositories/IApplicationRepository';
import { Application } from '../../domain/entities/Application';
import { Referral, ReferralStatus } from '../../domain/entities/Referral';
import { prisma } from '../prisma.client';

function toEntity(data: any): Application {
    let referralEntity: Referral | undefined;
    if (data.referral) {
        referralEntity = new Referral(
            data.referral.id,
            data.referral.applicationId,
            data.referral.status as ReferralStatus,
            data.referral.decisionDate,
            data.referral.whyThisRole,
            data.referral.relevantSkills,
            data.referral.expectedSalary,
            data.referral.applicationTimeline,
            data.referral.studentQuestions,
            data.referral.declineReason,
            data.referral.changesRequested,
            data.referral.approvedAt,
            data.referral.submittedToCompanyAt,
            data.referral.interviewScheduledAt,
            data.referral.offerReceivedAt
        );
    }

    return new Application(
        data.id,
        data.studentId,
        data.jobId,
        data.status as any,
        data.appliedAt,
        data.job,
        referralEntity
    );
}

export class PrismaApplicationRepository implements IApplicationRepository {
    async findById(id: string): Promise<Application | null> {
        const data = await prisma.application.findUnique({
            where: { id },
            include: { referral: true, job: true }
        });
        return data ? toEntity(data) : null;
    }

    async findAll(): Promise<Application[]> {
        const data = await prisma.application.findMany({
            include: { referral: true, job: true }
        });
        return data.map(toEntity);
    }

    async findByStudentId(studentId: string): Promise<Application[]> {
        const data = await prisma.application.findMany({
            where: { studentId },
            include: {
                job: { include: { alumni: true } },
                referral: true
            },
            orderBy: { appliedAt: 'desc' }
        });
        return data.map(toEntity);
    }

    async findByJobId(jobId: string): Promise<Application[]> {
        const data = await prisma.application.findMany({
            where: { jobId },
            include: { referral: true, student: true }
        });
        return data.map(toEntity);
    }

    async findByAlumniId(alumniId: string): Promise<Application[]> {
        const data = await prisma.application.findMany({
            where: {
                job: { alumniId }
            },
            include: {
                student: true,
                job: true,
                referral: true
            },
            orderBy: { appliedAt: 'desc' }
        });
        return data.map(toEntity);
    }

    async save(entity: Application): Promise<Application> {
        const id = entity.getId();
        const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);

        const payload = {
            status: entity.getStatus(),
            studentId: entity.getStudentId(),
            jobId: entity.getJobId(),
            appliedAt: entity.getAppliedAt(),
        };

        let data;
        if (isMongoId && await prisma.application.findUnique({ where: { id } })) {
            data = await prisma.application.update({
                where: { id },
                data: payload,
                include: { referral: true, job: true }
            });
        } else {
            data = await prisma.application.create({
                data: payload,
                include: { referral: true, job: true }
            });
        }
        return toEntity(data);
    }

    async update(id: string, entity: Application): Promise<Application | null> {
        return this.save(entity);
    }

    async delete(id: string): Promise<boolean> {
        await prisma.application.delete({ where: { id }});
        return true;
    }
}
