import { Request, Response } from 'express';
import { MentorshipSessionService } from '../services/MentorshipSessionService';
import { NotificationService, NotificationType } from '../services/NotificationService';
import { OfficeHours } from '../domain/entities/OfficeHours';

export class MentorshipController {
    constructor(
        private sessionService: MentorshipSessionService,
        private notificationService: NotificationService
    ) {}

    // OFFICE HOURS CONFIG
    public getAllMentors = async (req: Request, res: Response) => {
        try {
            const mentors = await this.sessionService.getAllMentors();
            res.json(mentors.map(m => ({
                id: m.getId(),
                name: m.getName(),
                email: m.getEmail(),
                role: m.getRole(),
                company: (m as any).getCompany?.(),
                designation: (m as any).getDesignation?.()
            })));
        } catch (error: any) { res.status(400).json({ error: error.message }); }
    }

    public getMentorDetails = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            const mentor = await this.sessionService.getMentorById(id);
            if (!mentor) return res.status(404).json({ error: 'Mentor not found' });
            res.json({
                id: mentor.getId(),
                name: mentor.getName(),
                email: mentor.getEmail(),
                company: (mentor as any).getCompany?.(),
                designation: (mentor as any).getDesignation?.()
            });
        } catch (error: any) { res.status(400).json({ error: error.message }); }
    }

    public getOfficeHours = async (req: Request, res: Response) => {
        try {
            const alumniId = req.params.alumniId as string;
            const oh = await this.sessionService.getOfficeHours(alumniId);
            res.json(oh || { enabled: false, weeklySchedule: [], preferences: {} });
        } catch (error: any) { res.status(400).json({ error: error.message }); }
    }

    public updateOfficeHours = async (req: Request, res: Response) => {
        try {
            const alumniId = req.params.alumniId as string;
            const { enabled, timezone, weeklySchedule, blackoutDates, preferences } = req.body;
            const oh = new OfficeHours('', alumniId, enabled, timezone, weeklySchedule, blackoutDates, preferences);
            const saved = await this.sessionService.saveOfficeHours(oh);
            res.json(saved);
        } catch (error: any) { res.status(400).json({ error: error.message }); }
    }

    // SLOTS & BOOKING
    public getAvailableSlots = async (req: Request, res: Response) => {
        try {
            const alumniId = req.params.alumniId as string;
            const { startDate, endDate } = req.query;
            const slots = await this.sessionService.getAvailableSlots(
                alumniId, 
                new Date(startDate as string), 
                new Date(endDate as string)
            );
            res.json(slots);
        } catch (error: any) { res.status(400).json({ error: error.message }); }
    }

    public bookSession = async (req: Request, res: Response) => {
        try {
            const { alumniId, studentId, slotData, bookingDetails } = req.body;
            const session = await this.sessionService.bookSession(alumniId, studentId, slotData, bookingDetails);
            
            // Notify both parties
            await this.notificationService.notifyUser(
                studentId, 
                "✓ Session Booked!", 
                `Your session with the mentor is scheduled for ${new Date(slotData.startTime).toLocaleString()}`,
                NotificationType.SESSION_BOOKED,
                `/mentorship/sessions/${session.getId()}`
            );
            await this.notificationService.notifyUser(
                alumniId,
                "New Mentorship Booking",
                `A student has booked a ${slotData.type} slot for ${new Date(slotData.startTime).toLocaleString()}`,
                NotificationType.SESSION_BOOKED,
                `/mentorship/sessions/${session.getId()}`
            );

            res.status(201).json(session);
        } catch (error: any) { res.status(400).json({ error: error.message }); }
    }

    // SESSION RETRIEVAL
    public getStudentSessions = async (req: Request, res: Response) => {
        try {
            const studentId = req.params.studentId as string;
            const sessions = await this.sessionService.getStudentSessions(studentId);
            res.json(sessions);
        } catch (error: any) { res.status(400).json({ error: error.message }); }
    }

    public getAlumniSessions = async (req: Request, res: Response) => {
        try {
            const alumniId = req.params.alumniId as string;
            const sessions = await this.sessionService.getAlumniSessions(alumniId);
            res.json(sessions);
        } catch (error: any) { res.status(400).json({ error: error.message }); }
    }

    public getSessionDetails = async (req: Request, res: Response) => {
        try {
            const sessionId = req.params.sessionId as string;
            const session = await this.sessionService.getSessionById(sessionId);
            if (!session) return res.status(404).json({ error: 'Session not found' });
            res.json(session);
        } catch (error: any) { res.status(400).json({ error: error.message }); }
    }

    public submitFeedback = async (req: Request, res: Response) => {
        try {
            const sessionId = req.params.sessionId as string;
            const { studentId, rating, notes } = req.body;
            const session = await this.sessionService.submitFeedback(sessionId, studentId, rating, notes);
            res.json(session);
        } catch (error: any) { res.status(400).json({ error: error.message }); }
    }

    public updateMeetingLink = async (req: Request, res: Response) => {
        try {
            const sessionId = req.params.sessionId as string;
            const { link } = req.body;
            const session = await this.sessionService.updateMeetingLink(sessionId, link);
            res.json(session);
        } catch (error: any) { res.status(400).json({ error: error.message }); }
    }

    public updateSessionStatus = async (req: Request, res: Response) => {
        try {
            const sessionId = req.params.sessionId as string;
            const { status } = req.body;
            const session = await this.sessionService.updateSessionStatus(sessionId, status);
            res.json(session);
        } catch (error: any) { res.status(400).json({ error: error.message }); }
    }

    // NOTIFICATIONS
    public getNotifications = async (req: Request, res: Response) => {
        try {
            const userId = req.params.userId as string;
            const notifs = await this.notificationService.getNotifications(userId);
            res.json(notifs);
        } catch (error: any) { res.status(400).json({ error: error.message }); }
    }

    public markNotificationRead = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            await this.notificationService.markAsRead(id);
            res.status(204).send();
        } catch (error: any) { res.status(400).json({ error: error.message }); }
    }
}
