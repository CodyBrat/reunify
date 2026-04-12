import { Post } from '../../domain/entities/Post';
import { IPostRepository } from '../../domain/repositories/IPostRepository';

export class InMemoryPostRepository implements IPostRepository {
    private posts: Map<string, Post> = new Map();

    async findById(id: string): Promise<Post | null> {
        return this.posts.get(id) || null;
    }

    async findAll(): Promise<Post[]> {
        return Array.from(this.posts.values());
    }

    async save(entity: Post): Promise<Post> {
        this.posts.set(entity.getId(), entity);
        return entity;
    }

    async update(id: string, entity: Post): Promise<Post | null> {
        if (!this.posts.has(id)) return null;
        this.posts.set(id, entity);
        return entity;
    }

    async delete(id: string): Promise<boolean> {
        return this.posts.delete(id);
    }

    async findAllOrderedByDate(): Promise<Post[]> {
        return Array.from(this.posts.values()).sort((a, b) => b.getCreatedAt().getTime() - a.getCreatedAt().getTime());
    }

    async findByAuthorId(authorId: string): Promise<Post[]> {
        return Array.from(this.posts.values()).filter(p => p.getAuthorId() === authorId);
    }
}
