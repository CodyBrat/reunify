export class Job {
    private id: string;
    private alumniId: string;
    private title: string;
    private description: string;
    private deadline: Date;
    private status: 'Open' | 'Closed';
    private createdAt: Date;

    constructor(
        id: string,
        alumniId: string,
        title: string,
        description: string,
        deadline: Date,
        status: 'Open' | 'Closed' = 'Open',
        createdAt: Date = new Date()
    ) {
        this.id = id;
        this.alumniId = alumniId;
        this.title = title;
        this.description = description;
        this.deadline = deadline;
        this.status = status;
        this.createdAt = createdAt;
    }

    public getId(): string { return this.id; }
    public getAlumniId(): string { return this.alumniId; }
    public getTitle(): string { return this.title; }
    public getDescription(): string { return this.description; }
    public getDeadline(): Date { return this.deadline; }
    public getStatus(): 'Open' | 'Closed' { return this.status; }
    public getCreatedAt(): Date { return this.createdAt; }

    public closeJob(): void {
        this.status = 'Closed';
    }

    public updateJob(title: string, description: string, deadline: Date): void {
        this.title = title;
        this.description = description;
        this.deadline = deadline;
    }
}
