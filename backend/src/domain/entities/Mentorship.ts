export class Mentorship {
    private id: string;
    private studentId: string;
    private alumniId: string;
    private message: string;
    private status: string;
    private createdAt: Date;
    private studentName?: string;
    private alumniName?: string;

    constructor(
        id: string,
        studentId: string,
        alumniId: string,
        message: string,
        status: string = 'Pending',
        createdAt: Date = new Date(),
        studentName?: string,
        alumniName?: string
    ) {
        this.id = id;
        this.studentId = studentId;
        this.alumniId = alumniId;
        this.message = message;
        this.status = status;
        this.createdAt = createdAt;
        this.studentName = studentName;
        this.alumniName = alumniName;
    }

    public getId(): string { return this.id; }
    public getStudentId(): string { return this.studentId; }
    public getAlumniId(): string { return this.alumniId; }
    public getMessage(): string { return this.message; }
    public getStatus(): string { return this.status; }
    public getCreatedAt(): Date { return this.createdAt; }
    public getStudentName(): string | undefined { return this.studentName; }
    public getAlumniName(): string | undefined { return this.alumniName; }
}
