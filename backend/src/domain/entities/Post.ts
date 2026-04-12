export class Post {
    private id: string;
    private authorId: string;
    private authorName?: string;
    private title: string;
    private content: string;
    private createdAt: Date;
    private likes: number;
    private likedBy: string[];

    constructor(
        id: string,
        authorId: string,
        title: string,
        content: string,
        createdAt: Date = new Date(),
        likes: number = 0,
        likedBy: string[] = [],
        authorName?: string
    ) {
        this.id = id;
        this.authorId = authorId;
        this.authorName = authorName;
        this.title = title;
        this.content = content;
        this.createdAt = createdAt;
        this.likes = likes;
        this.likedBy = likedBy;
    }

    public getId(): string { return this.id; }
    public getAuthorId(): string { return this.authorId; }
    public getAuthorName(): string | undefined { return this.authorName; }
    public getTitle(): string { return this.title; }
    public getContent(): string { return this.content; }
    public getCreatedAt(): Date { return this.createdAt; }
    public getLikes(): number { return this.likes; }
    public getLikedBy(): string[] { return this.likedBy; }

    public toggleLike(userId: string): void {
        const index = this.likedBy.indexOf(userId);
        if (index === -1) {
            this.likedBy.push(userId);
            this.likes++;
        } else {
            this.likedBy.splice(index, 1);
            this.likes--;
        }
    }
}
