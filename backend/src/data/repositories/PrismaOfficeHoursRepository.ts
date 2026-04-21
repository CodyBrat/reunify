import { IOfficeHoursRepository } from '../../domain/repositories/IOfficeHoursRepository';
import { OfficeHours } from '../../domain/entities/OfficeHours';
import { prisma } from '../prisma.client';

export class PrismaOfficeHoursRepository implements IOfficeHoursRepository {
  async findById(id: string): Promise<OfficeHours | null> {
    const data = await prisma.officeHours.findUnique({ where: { id } });
    return data ? this.toEntity(data) : null;
  }

  async findByAlumniId(alumniId: string): Promise<OfficeHours | null> {
    const data = await prisma.officeHours.findUnique({ where: { alumniId } });
    return data ? this.toEntity(data) : null;
  }

  async findAll(): Promise<OfficeHours[]> {
    const data = await prisma.officeHours.findMany();
    return data.map(d => this.toEntity(d));
  }

  async save(entity: OfficeHours): Promise<OfficeHours> {
    const alumniId = entity.getAlumniId();
    const payload = {
      enabled: entity.isEnabled(),
      timezone: entity.getTimezone(),
      weeklySchedule: entity.getWeeklySchedule(),
      blackoutDates: entity.getBlackoutDates(),
      preferences: entity.getPreferences(),
      updatedAt: new Date(),
    };

    const data = await prisma.officeHours.upsert({
      where: { alumniId },
      update: payload,
      create: { ...payload, alumniId },
    });

    return this.toEntity(data);
  }

  async update(id: string, entity: OfficeHours): Promise<OfficeHours | null> {
    return this.save(entity);
  }

  async delete(id: string): Promise<boolean> {
    await prisma.officeHours.delete({ where: { id } });
    return true;
  }

  private toEntity(d: any): OfficeHours {
    return new OfficeHours(
      d.id,
      d.alumniId,
      d.enabled,
      d.timezone,
      d.weeklySchedule,
      d.blackoutDates,
      d.preferences
    );
  }
}
