import { MentorshipSession } from '../entities/MentorshipSession';
import { IRepository } from './IRepository';

export interface IMentorshipSessionRepository extends IRepository<MentorshipSession> {
  findByAlumniId(alumniId: string): Promise<MentorshipSession[]>;
  findByStudentId(studentId: string): Promise<MentorshipSession[]>;
  findActiveByAlumniId(alumniId: string, startDate: Date, endDate: Date): Promise<MentorshipSession[]>;
}
