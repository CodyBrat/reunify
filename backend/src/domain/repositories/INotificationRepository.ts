import { Notification } from '../entities/Notification';
import { IRepository } from './IRepository';

export interface INotificationRepository extends IRepository<Notification> {
  findByUserId(userId: string): Promise<Notification[]>;
  markAsRead(id: string): Promise<void>;
}
