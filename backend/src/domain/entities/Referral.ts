export class Referral {
    private id: string;
    private applicationId: string;
    private status: 'Requested' | 'Under Review' | 'Approved' | 'Rejected';
    private decisionDate: Date | null;

    constructor(
        id: string,
        applicationId: string,
        status: 'Requested' | 'Under Review' | 'Approved' | 'Rejected' = 'Requested',
        decisionDate: Date | null = null
    ) {
        this.id = id;
        this.applicationId = applicationId;
        this.status = status;
        this.decisionDate = decisionDate;
    }

    public getId(): string { return this.id; }
    public getApplicationId(): string { return this.applicationId; }
    public getStatus(): 'Requested' | 'Under Review' | 'Approved' | 'Rejected' { return this.status; }
    public getDecisionDate(): Date | null { return this.decisionDate; }

    public approve(): void {
        this.status = 'Approved';
        this.decisionDate = new Date();
    }

    public reject(): void {
        this.status = 'Rejected';
        this.decisionDate = new Date();
    }
    
    public setUnderReview(): void {
        this.status = 'Under Review';
    }
}
