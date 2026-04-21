export class Notification {
  private id: string;
  private userId: string;
  private title: string;
  private message: string;
  private type: string;
  private link?: string;
  private isRead: boolean;
  private createdAt: Date;

  constructor(
    id: string,
    userId: string,
    title: string,
    message: string,
    type: string,
    link?: string,
    isRead: boolean = false,
    createdAt: Date = new Date()
  ) {
    this.id = id;
    this.userId = userId;
    this.title = title;
    this.message = message;
    this.type = type;
    this.link = link;
    this.isRead = isRead;
    this.createdAt = createdAt;
  }

  public getId(): string { return this.id; }
  public getUserId(): string { return this.userId; }
  public getTitle(): string { return this.title; }
  public getMessage(): string { return this.message; }
  public getType(): string { return this.type; }
  public getLink(): string | undefined { return this.link; }
  public isReadNow(): boolean { return this.isRead; }
  public getCreatedAt(): Date { return this.createdAt; }
}
