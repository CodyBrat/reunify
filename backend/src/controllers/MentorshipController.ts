import { Request, Response } from 'express';
import { MentorshipService } from '../services/MentorshipService';

export class MentorshipController {
    private mentorshipService: MentorshipService;

    constructor(mentorshipService: MentorshipService) {
        this.mentorshipService = mentorshipService;
    }

    public requestMentorship = async (req: Request, res: Response) => {
        try {
            const { studentId, alumniId, message } = req.body;
            const mentorship = await this.mentorshipService.requestMentorship(studentId, alumniId, message);
            res.status(201).json(mentorship);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    public getAllMentors = async (req: Request, res: Response) => {
        try {
            const mentors = await this.mentorshipService.getAllMentors();
            res.status(200).json(mentors.map(m => ({
                id: m.getId(),
                name: m.getName(),
                email: m.getEmail(),
                role: m.getRole(),
                company: (m as any).getCompany?.(),
                designation: (m as any).getDesignation?.()
            })));
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    public getStudentMentorships = async (req: Request, res: Response) => {
        try {
            const { studentId } = req.params;
            const mentorships = await this.mentorshipService.getStudentMentorships(studentId as string);
            res.status(200).json(mentorships.map(m => this.mapToJSON(m)));
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    public getAlumniMentorships = async (req: Request, res: Response) => {
        try {
            const { alumniId } = req.params;
            const mentorships = await this.mentorshipService.getAlumniMentorships(alumniId as string);
            res.status(200).json(mentorships.map(m => this.mapToJSON(m)));
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    public updateStatus = async (req: Request, res: Response) => {
        try {
            const { mentorshipId } = req.params;
            const { status } = req.body;
            const mentorship = await this.mentorshipService.updateStatus(mentorshipId as string, status);
            res.status(200).json(mentorship);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    private mapToJSON(m: any) {
        return {
            id: m.getId(),
            studentId: m.getStudentId(),
            alumniId: m.getAlumniId(),
            message: m.getMessage(),
            status: m.getStatus(),
            createdAt: m.getCreatedAt(),
            studentName: m.getStudentName(),
            alumniName: m.getAlumniName()
        };
    }
}
