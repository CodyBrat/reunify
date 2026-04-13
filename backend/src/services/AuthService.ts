import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { IUserRepository } from '../domain/repositories/IUserRepository';
import { Student } from '../domain/entities/Student';
import { Alumni } from '../domain/entities/Alumni';

export class AuthService {
    private userRepository: IUserRepository;
    private jwtSecret: string = process.env.JWT_SECRET || 'super-secret-reunify-key';

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    async registerStudent(name: string, email: string, passwordPlain: string, university: string, course: string, graduationYear: number): Promise<string> {
        const existing = await this.userRepository.findByEmail(email);
        if (existing) throw new Error('Email already registered');

        const hash = await bcrypt.hash(passwordPlain, 10);
        const student = new Student(uuidv4(), name, email, hash, university, course, graduationYear);
        const savedUser = await this.userRepository.save(student);

        return this.generateToken(savedUser.getId(), savedUser.getRole());
    }

    async registerAlumni(name: string, email: string, passwordPlain: string, company: string, designation: string, experienceYears: number): Promise<string> {
        const existing = await this.userRepository.findByEmail(email);
        if (existing) throw new Error('Email already registered');

        const hash = await bcrypt.hash(passwordPlain, 10);
        const alumni = new Alumni(uuidv4(), name, email, hash, company, designation, experienceYears, false);
        const savedUser = await this.userRepository.save(alumni);

        return this.generateToken(savedUser.getId(), savedUser.getRole());
    }

    async login(email: string, passwordPlain: string): Promise<{ token: string; role: string; name: string }> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new Error('Invalid credentials');

        const isValid = await bcrypt.compare(passwordPlain, user.getPasswordHash());
        if (!isValid) throw new Error('Invalid credentials');

        return {
            token: this.generateToken(user.getId(), user.getRole()),
            role: user.getRole(),
            name: user.getName()
        };
    }

    private generateToken(userId: string, role: string): string {
        return jwt.sign({ userId, role }, this.jwtSecret, { expiresIn: '1d' });
    }
}
