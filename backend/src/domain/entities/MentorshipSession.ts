export type MentorshipStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
export type MentorshipType = '1-on-1' | 'Group' | 'Drop-in';

export class MentorshipSession {
  private id: string;
  private alumniId: string;
  private studentIds: string[];
  private status: MentorshipStatus;
  private type: MentorshipType;
  private scheduledAt: Date;
  private duration: number;
  private meetingLink?: string;
  
  // Pre-session
  private message?: string;
  private topics: string[];
  private questions: any; // { studentId, questions: string[] }[]
  private materials: any; // { studentId, resumeUrl, portfolioUrl }[]
  
  // Post-session
  private sessionNotes?: string;
  private actionItems: any; // { studentId, tasks: string[] }[]
  private feedback: any;    // { studentId, rating, takeaways, wouldBookAgain }[]
  private alumniSummary?: string;
  private followUpNeeded: boolean;
  
  private createdAt: Date;
  private updatedAt: Date;

  // Extra context for UI
  public alumniName?: string;
  public studentNames?: string[];

  constructor(
    id: string,
    alumniId: string,
    studentIds: string[],
    scheduledAt: Date,
    duration: number,
    status: MentorshipStatus = 'SCHEDULED',
    type: MentorshipType = '1-on-1',
    meetingLink?: string,
    message?: string,
    topics: string[] = [],
    questions: any = null,
    materials: any = null,
    sessionNotes?: string,
    actionItems: any = null,
    feedback: any = null,
    alumniSummary?: string,
    followUpNeeded: boolean = false,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    this.id = id;
    this.alumniId = alumniId;
    this.studentIds = studentIds;
    this.status = status;
    this.type = type;
    this.scheduledAt = scheduledAt;
    this.duration = duration;
    this.meetingLink = meetingLink;
    this.message = message;
    this.topics = topics;
    this.questions = questions;
    this.materials = materials;
    this.sessionNotes = sessionNotes;
    this.actionItems = actionItems;
    this.feedback = feedback;
    this.alumniSummary = alumniSummary;
    this.followUpNeeded = followUpNeeded;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Getters
  public getId(): string { return this.id; }
  public getAlumniId(): string { return this.alumniId; }
  public getStudentIds(): string[] { return this.studentIds; }
  public getStatus(): MentorshipStatus { return this.status; }
  public getType(): MentorshipType { return this.type; }
  public getScheduledAt(): Date { return this.scheduledAt; }
  public getDuration(): number { return this.duration; }
  public getMeetingLink(): string | undefined { return this.meetingLink; }
  public getMessage(): string | undefined { return this.message; }
  public getTopics(): string[] { return this.topics; }
  public getQuestions(): any { return this.questions; }
  public getMaterials(): any { return this.materials; }
  public getSessionNotes(): string | undefined { return this.sessionNotes; }
  public getActionItems(): any { return this.actionItems; }
  public getFeedback(): any { return this.feedback; }
  public getAlumniSummary(): string | undefined { return this.alumniSummary; }
  public isFollowUpNeeded(): boolean { return this.followUpNeeded; }
  public getCreatedAt(): Date { return this.createdAt; }
  public getUpdatedAt(): Date { return this.updatedAt; }

  // Setters/Business Logic
  public complete(summary: string, notes: string): void {
    this.status = 'COMPLETED';
    this.alumniSummary = summary;
    this.sessionNotes = notes;
    this.updatedAt = new Date();
  }

  public cancel(): void {
    this.status = 'CANCELLED';
    this.updatedAt = new Date();
  }
}
