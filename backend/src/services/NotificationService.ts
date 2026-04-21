import { INotificationRepository } from '../domain/repositories/INotificationRepository';
import { Notification } from '../domain/entities/Notification';
import { v4 as uuidv4 } from 'uuid';

export enum NotificationType {
  INFO = 'INFO',
  SESSION_BOOKED = 'SESSION_BOOKED',
  SESSION_CANCELLED = 'SESSION_CANCELLED',
  REMINDER = 'REMINDER',
  FEEDBACK_REQUEST = 'FEEDBACK_REQUEST'
}

export class NotificationService {
  constructor(private notificationRepository: INotificationRepository) {}

  async notifyUser(userId: string, title: string, message: string, type: NotificationType, link?: string): Promise<Notification> {
    const notification = new Notification(
      uuidv4(),
      userId,
      title,
      message,
      type,
      link
    );
    const saved = await this.notificationRepository.save(notification);
    
    // In a real app, this is where we'd also trigger EmailJS/Socket.io
    console.log(`[Notification Triggered] to User ${userId}: ${title}`);
    
    return saved;
  }

  async getNotifications(userId: string): Promise<Notification[]> {
    return await this.notificationRepository.findByUserId(userId);
  }

  async markAsRead(id: string): Promise<void> {
    await this.notificationRepository.markAsRead(id);
  }
}
