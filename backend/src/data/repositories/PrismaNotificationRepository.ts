import { INotificationRepository } from '../../domain/repositories/INotificationRepository';
import { Notification } from '../../domain/entities/Notification';
import { prisma } from '../prisma.client';

export class PrismaNotificationRepository implements INotificationRepository {
  async findById(id: string): Promise<Notification | null> {
    const data = await prisma.notification.findUnique({ where: { id } });
    return data ? this.toEntity(data) : null;
  }

  async findByUserId(userId: string): Promise<Notification[]> {
    const data = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    return data.map(d => this.toEntity(d));
  }

  async findAll(): Promise<Notification[]> {
    const data = await prisma.notification.findMany();
    return data.map(toEntity => this.toEntity(toEntity));
  }

  async markAsRead(id: string): Promise<void> {
    await prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });
  }

  async save(entity: Notification): Promise<Notification> {
    const data = await prisma.notification.create({
      data: {
        userId: entity.getUserId(),
        title: entity.getTitle(),
        message: entity.getMessage(),
        type: entity.getType(),
        link: entity.getLink(),
        isRead: entity.isReadNow(),
        createdAt: entity.getCreatedAt()
      }
    });
    return this.toEntity(data);
  }

  async update(id: string, entity: Notification): Promise<Notification | null> {
    const data = await prisma.notification.update({
      where: { id },
      data: {
        isRead: entity.isReadNow()
      }
    });
    return this.toEntity(data);
  }

  async delete(id: string): Promise<boolean> {
    await prisma.notification.delete({ where: { id } });
    return true;
  }

  private toEntity(d: any): Notification {
    return new Notification(
      d.id,
      d.userId,
      d.title,
      d.message,
      d.type,
      d.link,
      d.isRead,
      d.createdAt
    );
  }
}
