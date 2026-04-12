export class Application {
    private id: string;
    private studentId: string;
    private jobId: string;
    private status: 'Applied' | 'Reviewing' | 'Accepted' | 'Rejected';
    private appliedAt: Date;

    constructor(
        id: string,
        studentId: string,
        jobId: string,
        status: 'Applied' | 'Reviewing' | 'Accepted' | 'Rejected' = 'Applied',
        appliedAt: Date = new Date()
    ) {
        this.id = id;
        this.studentId = studentId;
        this.jobId = jobId;
        this.status = status;
        this.appliedAt = appliedAt;
    }

    public getId(): string { return this.id; }
    public getStudentId(): string { return this.studentId; }
    public getJobId(): string { return this.jobId; }
    public getStatus(): 'Applied' | 'Reviewing' | 'Accepted' | 'Rejected' { return this.status; }
    public getAppliedAt(): Date { return this.appliedAt; }

    public updateStatus(newStatus: 'Applied' | 'Reviewing' | 'Accepted' | 'Rejected'): void {
        this.status = newStatus;
    }
}
