export class OfficeHours {
  private id: string;
  private alumniId: string;
  private enabled: boolean;
  private timezone: string;
  private weeklySchedule: any;
  private blackoutDates: Date[];
  private preferences: any;

  constructor(
    id: string,
    alumniId: string,
    enabled: boolean = false,
    timezone: string = 'UTC',
    weeklySchedule: any = null,
    blackoutDates: Date[] = [],
    preferences: any = null
  ) {
    this.id = id;
    this.alumniId = alumniId;
    this.enabled = enabled;
    this.timezone = timezone;
    this.weeklySchedule = weeklySchedule;
    this.blackoutDates = blackoutDates;
    this.preferences = preferences;
  }

  public getId(): string { return this.id; }
  public getAlumniId(): string { return this.alumniId; }
  public isEnabled(): boolean { return this.enabled; }
  public getTimezone(): string { return this.timezone; }
  public getWeeklySchedule(): any { return this.weeklySchedule; }
  public getBlackoutDates(): Date[] { return this.blackoutDates; }
  public getPreferences(): any { return this.preferences; }
}
