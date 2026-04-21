export type ReferralStatus =
  | 'Pending'
  | 'Under Review'
  | 'Approved'
  | 'Referral Submitted'
  | 'Interview Scheduled'
  | 'Offer Received'
  | 'Rejected'
  | 'Declined'
  | 'Changes Requested'
  | 'Withdrawn';

export class Referral {
    private id: string;
    private applicationId: string;
    private status: ReferralStatus;
    private decisionDate: Date | null;

    // Student context
    private whyThisRole: string;
    private relevantSkills: string[];
    private expectedSalary: string;
    private applicationTimeline: string;
    private studentQuestions: string;

    // Alumni response
    private declineReason: string;
    private changesRequested: string;

    // Outcome timestamps
    private approvedAt: Date | null;
    private submittedToCompanyAt: Date | null;
    private interviewScheduledAt: Date | null;
    private offerReceivedAt: Date | null;

    constructor(
        id: string,
        applicationId: string,
        status: ReferralStatus = 'Pending',
        decisionDate: Date | null = null,
        whyThisRole = '',
        relevantSkills: string[] = [],
        expectedSalary = '',
        applicationTimeline = '',
        studentQuestions = '',
        declineReason = '',
        changesRequested = '',
        approvedAt: Date | null = null,
        submittedToCompanyAt: Date | null = null,
        interviewScheduledAt: Date | null = null,
        offerReceivedAt: Date | null = null,
    ) {
        this.id = id;
        this.applicationId = applicationId;
        this.status = status;
        this.decisionDate = decisionDate;
        this.whyThisRole = whyThisRole;
        this.relevantSkills = relevantSkills;
        this.expectedSalary = expectedSalary;
        this.applicationTimeline = applicationTimeline;
        this.studentQuestions = studentQuestions;
        this.declineReason = declineReason;
        this.changesRequested = changesRequested;
        this.approvedAt = approvedAt;
        this.submittedToCompanyAt = submittedToCompanyAt;
        this.interviewScheduledAt = interviewScheduledAt;
        this.offerReceivedAt = offerReceivedAt;
    }

    // Getters
    public getId(): string { return this.id; }
    public getApplicationId(): string { return this.applicationId; }
    public getStatus(): ReferralStatus { return this.status; }
    public getDecisionDate(): Date | null { return this.decisionDate; }
    public getWhyThisRole(): string { return this.whyThisRole; }
    public getRelevantSkills(): string[] { return this.relevantSkills; }
    public getExpectedSalary(): string { return this.expectedSalary; }
    public getApplicationTimeline(): string { return this.applicationTimeline; }
    public getStudentQuestions(): string { return this.studentQuestions; }
    public getDeclineReason(): string { return this.declineReason; }
    public getChangesRequested(): string { return this.changesRequested; }
    public getApprovedAt(): Date | null { return this.approvedAt; }
    public getSubmittedToCompanyAt(): Date | null { return this.submittedToCompanyAt; }
    public getInterviewScheduledAt(): Date | null { return this.interviewScheduledAt; }
    public getOfferReceivedAt(): Date | null { return this.offerReceivedAt; }

    // State transitions
    public enrich(data: {
        whyThisRole?: string;
        relevantSkills?: string[];
        expectedSalary?: string;
        applicationTimeline?: string;
        studentQuestions?: string;
    }): void {
        if (data.whyThisRole !== undefined) this.whyThisRole = data.whyThisRole;
        if (data.relevantSkills !== undefined) this.relevantSkills = data.relevantSkills;
        if (data.expectedSalary !== undefined) this.expectedSalary = data.expectedSalary;
        if (data.applicationTimeline !== undefined) this.applicationTimeline = data.applicationTimeline;
        if (data.studentQuestions !== undefined) this.studentQuestions = data.studentQuestions;
        this.status = 'Pending';
    }

    public setUnderReview(): void {
        this.status = 'Under Review';
    }

    public approve(): void {
        this.status = 'Approved';
        this.decisionDate = new Date();
        this.approvedAt = new Date();
    }

    public markSubmittedToCompany(): void {
        this.status = 'Referral Submitted';
        this.submittedToCompanyAt = new Date();
    }

    public scheduleInterview(): void {
        this.status = 'Interview Scheduled';
        this.interviewScheduledAt = new Date();
    }

    public markOfferReceived(): void {
        this.status = 'Offer Received';
        this.offerReceivedAt = new Date();
    }

    public decline(reason: string): void {
        this.status = 'Declined';
        this.declineReason = reason;
        this.decisionDate = new Date();
    }

    public requestChanges(message: string): void {
        this.status = 'Changes Requested';
        this.changesRequested = message;
    }

    public reject(): void {
        this.status = 'Rejected';
        this.decisionDate = new Date();
    }

    public withdraw(): void {
        this.status = 'Withdrawn';
    }
}
