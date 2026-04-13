import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
    private authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    public registerStudent = async (req: Request, res: Response) => {
        try {
            const { name, email, password, university, course, graduationYear } = req.body;
            const token = await this.authService.registerStudent(name, email, password, university, course, graduationYear);
            res.status(201).json({ token });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    public registerAlumni = async (req: Request, res: Response) => {
        try {
            const { name, email, password, company, designation, experienceYears } = req.body;
            const token = await this.authService.registerAlumni(name, email, password, company, designation, experienceYears);
            res.status(201).json({ token });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    public login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const authData = await this.authService.login(email, password);
            res.status(200).json(authData);
        } catch (error: any) {
            res.status(401).json({ error: error.message });
        }
    }
}
