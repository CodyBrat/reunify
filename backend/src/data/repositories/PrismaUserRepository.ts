import { User, Student, Alumni, Admin } from '../../domain/entities';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { prisma } from '../prisma.client';

export class PrismaUserRepository implements IUserRepository {
    
    async findById(id: string): Promise<User | null> {
        const data = await prisma.user.findUnique({ where: { id } });
        return data ? this.mapToDomain(data) : null;
    }

    async findAll(): Promise<User[]> {
        const data = await prisma.user.findMany();
        return data.map(d => this.mapToDomain(d));
    }

    async save(entity: User): Promise<User> {
        const id = entity.getId();
        const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);

        let existing = null;
        if (isMongoId) {
            existing = await prisma.user.findUnique({ where: { id } });
        }

        let saved;
        if (existing) {
            // Update logic here if needed
            saved = existing; 
        } else if (entity.getRole() === 'Student') {
            const student = entity as any;
            saved = await prisma.user.create({
                data: {
                    name: entity.getName(),
                    email: entity.getEmail(),
                    passwordHash: entity.getPasswordHash(),
                    role: 'Student',
                    university: student.getUniversity(),
                    course: student.getCourse(),
                    graduationYear: student.getGraduationYear()
                }
            });
        } else {
            const alumni = entity as any;
            saved = await prisma.user.create({
                data: {
                    name: entity.getName(),
                    email: entity.getEmail(),
                    passwordHash: entity.getPasswordHash(),
                    role: 'Alumni',
                    company: alumni.getCompany(),
                    designation: alumni.getDesignation(),
                    experienceYears: alumni.getExperienceYears(),
                    isVerified: alumni.getVerificationStatus()
                }
            });
        }
        return this.mapToDomain(saved);
    }

    async update(id: string, entity: User): Promise<User | null> {
        // Implement when needed for profile updates
        return entity;
    }

    async delete(id: string): Promise<boolean> {
        await prisma.user.delete({ where: { id } });
        return true;
    }

    async findByEmail(email: string): Promise<User | null> {
        const data = await prisma.user.findUnique({ where: { email } });
        return data ? this.mapToDomain(data) : null;
    }

    async findByRole(role: string): Promise<User[]> {
        const data = await prisma.user.findMany({ where: { role } });
        return data.map(d => this.mapToDomain(d));
    }

    private mapToDomain(data: any): User {
        if (data.role === 'Student') {
            return new Student(data.id, data.name, data.email, data.passwordHash, data.university || '', data.course || '', data.graduationYear || 0);
        } else if (data.role === 'Alumni') {
            return new Alumni(data.id, data.name, data.email, data.passwordHash, data.company || '', data.designation || '', data.experienceYears || 0, data.isVerified || false);
        }
        return new Admin(data.id, data.name, data.email, data.passwordHash);
    }
}
