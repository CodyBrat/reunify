import { User } from './User';

export class Student extends User {
    private university: string;
    private course: string;
    private graduationYear: number;

    constructor(
        id: string, 
        name: string, 
        email: string, 
        passwordHash: string, 
        university: string, 
        course: string, 
        graduationYear: number
    ) {
        super(id, name, email, passwordHash, 'Student');
        this.university = university;
        this.course = course;
        this.graduationYear = graduationYear;
    }

    public getUniversity(): string { return this.university; }
    public getCourse(): string { return this.course; }
    public getGraduationYear(): number { return this.graduationYear; }

    public updateProfile(university: string, course: string, graduationYear: number): void {
        this.university = university;
        this.course = course;
        this.graduationYear = graduationYear;
    }
}
