import { User } from './User';

export class Alumni extends User {
    private company: string;
    private designation: string;
    private experienceYears: number;
    private isVerified: boolean;

    constructor(
        id: string, 
        name: string, 
        email: string, 
        passwordHash: string, 
        company: string, 
        designation: string, 
        experienceYears: number,
        isVerified: boolean = false
    ) {
        super(id, name, email, passwordHash, 'Alumni');
        this.company = company;
        this.designation = designation;
        this.experienceYears = experienceYears;
        this.isVerified = isVerified;
    }

    public getCompany(): string { return this.company; }
    public getDesignation(): string { return this.designation; }
    public getExperienceYears(): number { return this.experienceYears; }
    public getVerificationStatus(): boolean { return this.isVerified; }

    public verify(): void {
        this.isVerified = true;
    }

    public updateProfile(company: string, designation: string, experienceYears: number): void {
        this.company = company;
        this.designation = designation;
        this.experienceYears = experienceYears;
    }
}
