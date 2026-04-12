import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

export class InMemoryUserRepository implements IUserRepository {
    private users: Map<string, User> = new Map();

    async findById(id: string): Promise<User | null> {
        return this.users.get(id) || null;
    }

    async findAll(): Promise<User[]> {
        return Array.from(this.users.values());
    }

    async save(entity: User): Promise<User> {
        this.users.set(entity.getId(), entity);
        return entity;
    }

    async update(id: string, entity: User): Promise<User | null> {
        if (!this.users.has(id)) return null;
        this.users.set(id, entity);
        return entity;
    }

    async delete(id: string): Promise<boolean> {
        return this.users.delete(id);
    }

    async findByEmail(email: string): Promise<User | null> {
        for (const user of this.users.values()) {
            if (user.getEmail() === email) {
                return user;
            }
        }
        return null;
    }

    async findByRole(role: string): Promise<User[]> {
        return Array.from(this.users.values()).filter(u => u.getRole() === role);
    }
}
