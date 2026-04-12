import { User } from '../entities/User';
import { IRepository } from './IRepository';

export interface IUserRepository extends IRepository<User> {
    findByEmail(email: string): Promise<User | null>;
    findByRole(role: string): Promise<User[]>;
}
