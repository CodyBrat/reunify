import { v4 as uuidv4 } from 'uuid';
import { IMentorshipRepository } from '../domain/repositories/IMentorshipRepository';
import { Mentorship } from '../domain/entities/Mentorship';
import { IUserRepository } from '../domain/repositories/IUserRepository';
import { User } from '../domain/entities/User';

export class MentorshipService {
    private mentorshipRepository: IMentorshipRepository;
    private userRepository: IUserRepository;

    constructor(mentorshipRepository: IMentorshipRepository, userRepository: IUserRepository) {
        this.mentorshipRepository = mentorshipRepository;
        this.userRepository = userRepository;
    }

    async getAllMentors(): Promise<User[]> {
        return await this.userRepository.findByRole('Alumni');
    }

    async requestMentorship(studentId: string, alumniId: string, message: string): Promise<Mentorship> {
        const mentorship = new Mentorship(uuidv4(), studentId, alumniId, message);
        return await this.mentorshipRepository.save(mentorship);
    }

    async getStudentMentorships(studentId: string): Promise<Mentorship[]> {
        return await this.mentorshipRepository.findByStudentId(studentId);
    }

    async getAlumniMentorships(alumniId: string): Promise<Mentorship[]> {
        return await this.mentorshipRepository.findByAlumniId(alumniId);
    }

    async updateStatus(mentorshipId: string, status: string): Promise<Mentorship | null> {
        const mentorship = await this.mentorshipRepository.findById(mentorshipId);
        if (!mentorship) return null;
        
        const updated = new Mentorship(
            mentorship.getId(),
            mentorship.getStudentId(),
            mentorship.getAlumniId(),
            mentorship.getMessage(),
            status,
            mentorship.getCreatedAt()
        );
        return await this.mentorshipRepository.save(updated);
    }
}
