import { Mentorship } from '../entities/Mentorship';
import { IRepository } from './IRepository';

export interface IMentorshipRepository extends IRepository<Mentorship> {
    findByStudentId(studentId: string): Promise<Mentorship[]>;
    findByAlumniId(alumniId: string): Promise<Mentorship[]>;
}
