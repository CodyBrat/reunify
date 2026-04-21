import { IMentorshipSessionRepository } from '../../domain/repositories/IMentorshipSessionRepository';
import { MentorshipSession, MentorshipStatus, MentorshipType } from '../../domain/entities/MentorshipSession';
import { prisma } from '../prisma.client';

export class PrismaMentorshipSessionRepository implements IMentorshipSessionRepository {
  async findById(id: string): Promise<MentorshipSession | null> {
    const data = await prisma.mentorshipSession.findUnique({
      where: { id },
      include: { 
        alumni: { select: { name: true } },
        students: { select: { name: true } }
      }
    });
    return data ? this.toEntity(data) : null;
  }

  async findByAlumniId(alumniId: string): Promise<MentorshipSession[]> {
    const data = await prisma.mentorshipSession.findMany({
      where: { alumniId },
      include: { students: { select: { name: true } } },
      orderBy: { scheduledAt: 'desc' }
    });
    return data.map(d => this.toEntity(d));
  }

  async findByStudentId(studentId: string): Promise<MentorshipSession[]> {
    const data = await prisma.mentorshipSession.findMany({
      where: { studentIds: { has: studentId } },
      include: { alumni: { select: { name: true } } },
      orderBy: { scheduledAt: 'desc' }
    });
    return data.map(d => this.toEntity(d));
  }

  async findActiveByAlumniId(alumniId: string, startDate: Date, endDate: Date): Promise<MentorshipSession[]> {
    const data = await prisma.mentorshipSession.findMany({
      where: {
        alumniId,
        scheduledAt: { gte: startDate, lte: endDate },
        status: 'SCHEDULED'
      }
    });
    return data.map(d => this.toEntity(d));
  }

  async findAll(): Promise<MentorshipSession[]> {
    const data = await prisma.mentorshipSession.findMany();
    return data.map(d => this.toEntity(d));
  }

  async save(entity: MentorshipSession): Promise<MentorshipSession> {
    const id = entity.getId();
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);

    const payload = {
      alumniId: entity.getAlumniId(),
      studentIds: entity.getStudentIds(),
      status: entity.getStatus(),
      type: entity.getType(),
      scheduledAt: entity.getScheduledAt(),
      duration: entity.getDuration(),
      meetingLink: entity.getMeetingLink(),
      message: entity.getMessage(),
      topics: entity.getTopics(),
      questions: entity.getQuestions(),
      materials: entity.getMaterials(),
      sessionNotes: entity.getSessionNotes(),
      actionItems: entity.getActionItems(),
      feedback: entity.getFeedback(),
      alumniSummary: entity.getAlumniSummary(),
      followUpNeeded: entity.isFollowUpNeeded(),
      updatedAt: new Date(),
    };

    let data;
    if (isMongoId && await prisma.mentorshipSession.findUnique({ where: { id } })) {
      data = await prisma.mentorshipSession.update({
        where: { id },
        data: payload,
        include: { alumni: { select: { name: true } }, students: { select: { name: true } } }
      });
    } else {
      data = await prisma.mentorshipSession.create({
        data: { ...payload, id: isMongoId ? id : undefined },
        include: { alumni: { select: { name: true } }, students: { select: { name: true } } }
      });
    }

    return this.toEntity(data);
  }

  async update(id: string, entity: MentorshipSession): Promise<MentorshipSession | null> {
    return this.save(entity);
  }

  async delete(id: string): Promise<boolean> {
    await prisma.mentorshipSession.delete({ where: { id } });
    return true;
  }

  private toEntity(d: any): MentorshipSession {
    const session = new MentorshipSession(
      d.id,
      d.alumniId,
      d.studentIds,
      d.scheduledAt,
      d.duration,
      d.status as MentorshipStatus,
      d.type as MentorshipType,
      d.meetingLink,
      d.message,
      d.topics,
      d.questions,
      d.materials,
      d.sessionNotes,
      d.actionItems,
      d.feedback,
      d.alumniSummary,
      d.followUpNeeded,
      d.createdAt,
      d.updatedAt
    );
    session.alumniName = d.alumni?.name;
    session.studentNames = d.students?.map((s: any) => s.name);
    return session;
  }
}
