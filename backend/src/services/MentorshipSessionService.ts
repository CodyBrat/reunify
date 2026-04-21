import { v4 as uuidv4 } from 'uuid';
import { IMentorshipSessionRepository } from '../domain/repositories/IMentorshipSessionRepository';
import { IOfficeHoursRepository } from '../domain/repositories/IOfficeHoursRepository';
import { IUserRepository } from '../domain/repositories/IUserRepository';
import { MentorshipSession, MentorshipStatus, MentorshipType } from '../domain/entities/MentorshipSession';
import { OfficeHours } from '../domain/entities/OfficeHours';
import { User } from '../domain/entities/User';

export class MentorshipSessionService {
  constructor(
    private sessionRepository: IMentorshipSessionRepository,
    private officeHoursRepository: IOfficeHoursRepository,
    private userRepository: IUserRepository
  ) {}

  async getAllMentors(): Promise<User[]> {
    return await this.userRepository.findByRole('Alumni');
  }

  async getMentorById(id: string): Promise<User | null> {
    return await this.userRepository.findById(id);
  }

  async getOfficeHours(alumniId: string): Promise<OfficeHours | null> {
    return await this.officeHoursRepository.findByAlumniId(alumniId);
  }

  async saveOfficeHours(oh: OfficeHours): Promise<OfficeHours> {
    return await this.officeHoursRepository.save(oh);
  }

  /**
   * Generates available slots for a specific alumni over a date range.
   */
  async getAvailableSlots(alumniId: string, startDate: Date, endDate: Date): Promise<any[]> {
    const oh = await this.officeHoursRepository.findByAlumniId(alumniId);
    if (!oh || !oh.isEnabled()) return [];

    const sessions = await this.sessionRepository.findActiveByAlumniId(alumniId, startDate, endDate);
    const schedule = oh.getWeeklySchedule();
    if (!schedule) return [];

    const availableSlots: any[] = [];
    const curr = new Date(startDate);
    
    // Normalize to start of day
    curr.setHours(0, 0, 0, 0);

    while (curr <= endDate) {
      const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayName = DAYS[curr.getDay()];
      const dayConfig = schedule.find((s: any) => s.day === dayName);

      if (dayConfig && dayConfig.slots) {
        for (const slot of dayConfig.slots) {
          const [hours, minutes] = slot.startTime.split(':').map(Number);
          const slotDate = new Date(curr);
          slotDate.setHours(hours, minutes, 0, 0);

          // Skip if in the past or violates minAdvanceBooking
          const minAdvance = (oh.getPreferences()?.minAdvanceBooking || 24) * 60 * 60 * 1000;
          if (slotDate.getTime() < Date.now() + minAdvance) continue;

          // Check for blackout dates
          const isBlackout = oh.getBlackoutDates()?.some(d => 
            new Date(d).toDateString() === slotDate.toDateString()
          );
          if (isBlackout) continue;

          // Check if slot is taken
          const sessionsAtTime = sessions.filter(s => 
            s.getScheduledAt().getTime() === slotDate.getTime()
          );
          
          const studentCount = sessionsAtTime.reduce((acc, s) => acc + s.getStudentIds().length, 0);
          const maxStudents = slot.maxStudents || 1;

          if (studentCount < maxStudents) {
            availableSlots.push({
              id: `${alumniId}-${slotDate.getTime()}`,
              startTime: slotDate,
              duration: slot.duration,
              type: slot.type,
              maxStudents: maxStudents,
              remainingSpots: maxStudents - studentCount
            });
          }
        }
      }
      curr.setDate(curr.getDate() + 1);
    }

    return availableSlots;
  }

  async bookSession(alumniId: string, studentId: string, slotData: any, bookingDetails: any): Promise<MentorshipSession> {
    // Check if a session already exists for this alumni at this time (for group sessions)
    const existingSessions = await this.sessionRepository.findActiveByAlumniId(
      alumniId, 
      new Date(slotData.startTime), 
      new Date(slotData.startTime)
    );

    let session: MentorshipSession;
    
    if (existingSessions.length > 0 && slotData.type === 'Group') {
      // Add student to existing group session
      const existing = existingSessions[0];
      const studentIds = [...existing.getStudentIds(), studentId];
      
      session = new MentorshipSession(
        existing.getId(),
        alumniId,
        studentIds,
        existing.getScheduledAt(),
        existing.getDuration(),
        existing.getStatus(),
        existing.getType(),
        existing.getMeetingLink(),
        existing.getMessage(),
        Array.from(new Set([...existing.getTopics(), ...bookingDetails.topics])),
        [...(existing.getQuestions() || []), { studentId, questions: bookingDetails.questions }],
        [...(existing.getMaterials() || []), { studentId, ...bookingDetails.materials }]
      );
    } else {
      // Create new session
      session = new MentorshipSession(
        uuidv4(),
        alumniId,
        [studentId],
        new Date(slotData.startTime),
        slotData.duration,
        'SCHEDULED',
        slotData.type,
        '', // Initial meeting link
        '',
        bookingDetails.topics,
        [{ studentId, questions: bookingDetails.questions }],
        [{ studentId, ...bookingDetails.materials }]
      );
    }

    return await this.sessionRepository.save(session);
  }

  async getStudentSessions(studentId: string): Promise<MentorshipSession[]> {
    return await this.sessionRepository.findByStudentId(studentId);
  }

  async getAlumniSessions(alumniId: string): Promise<MentorshipSession[]> {
    return await this.sessionRepository.findByAlumniId(alumniId);
  }

  async getSessionById(sessionId: string): Promise<MentorshipSession | null> {
    return await this.sessionRepository.findById(sessionId);
  }

  async submitFeedback(sessionId: string, studentId: string, rating: number, notes: string): Promise<MentorshipSession | null> {
    const session = await this.sessionRepository.findById(sessionId);
    if (!session) return null;

    const existingFeedback = session.getFeedback() || [];
    const updatedFeedback = [...existingFeedback.filter((f: any) => f.studentId !== studentId), { studentId, rating, notes }];

    const updated = new MentorshipSession(
      session.getId(),
      session.getAlumniId(),
      session.getStudentIds(),
      session.getScheduledAt(),
      session.getDuration(),
      session.getStatus(),
      session.getType(),
      session.getMeetingLink(),
      session.getMessage(),
      session.getTopics(),
      session.getQuestions(),
      session.getMaterials(),
      session.getSessionNotes(),
      session.getActionItems(),
      updatedFeedback,
      session.getAlumniSummary(),
      session.isFollowUpNeeded()
    );
    return await this.sessionRepository.save(updated);
  }

  async updateSessionStatus(sessionId: string, status: MentorshipStatus): Promise<MentorshipSession | null> {
    const session = await this.sessionRepository.findById(sessionId);
    if (!session) return null;
    
    const updated = new MentorshipSession(
      session.getId(),
      session.getAlumniId(),
      session.getStudentIds(),
      session.getScheduledAt(),
      session.getDuration(),
      status,
      session.getType(),
      session.getMeetingLink(),
      session.getMessage(),
      session.getTopics(),
      session.getQuestions(),
      session.getMaterials(),
      session.getSessionNotes(),
      session.getActionItems(),
      session.getFeedback(),
      session.getAlumniSummary(),
      session.isFollowUpNeeded()
    );
    return await this.sessionRepository.save(updated);
  }

  async updateMeetingLink(sessionId: string, link: string): Promise<MentorshipSession | null> {
    const session = await this.sessionRepository.findById(sessionId);
    if (!session) return null;
    
    const updated = new MentorshipSession(
      session.getId(),
      session.getAlumniId(),
      session.getStudentIds(),
      session.getScheduledAt(),
      session.getDuration(),
      session.getStatus(),
      session.getType(),
      link,
      session.getMessage(),
      session.getTopics(),
      session.getQuestions(),
      session.getMaterials(),
      session.getSessionNotes(),
      session.getActionItems(),
      session.getFeedback(),
      session.getAlumniSummary(),
      session.isFollowUpNeeded()
    );
    return await this.sessionRepository.save(updated);
  }
}
