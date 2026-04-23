import { IPostRepository } from '../../domain/repositories/IPostRepository';
import { Post } from '../../domain/entities/Post';
import { prisma } from '../prisma.client';

export class PrismaPostRepository implements IPostRepository {
    async findById(id: string): Promise<Post | null> {
        const data = await prisma.post.findUnique({ 
            where: { id },
            include: { author: { select: { name: true } } }
        });
        return data ? new Post(data.id, data.authorId, data.title, data.content, data.createdAt, data.likes, data.likedBy, data.author?.name, (data.comments as any[]) || []) : null;
    }

    async findAll(): Promise<Post[]> {
        const data = await prisma.post.findMany({
            include: { author: { select: { name: true } } }
        });
        return data.map(d => new Post(d.id, d.authorId, d.title, d.content, d.createdAt, d.likes, d.likedBy, d.author?.name, (d.comments as any[]) || []));
    }

    async findAllOrderedByDate(): Promise<Post[]> {
        const data = await prisma.post.findMany({ 
            orderBy: { createdAt: 'desc' },
            include: { author: { select: { name: true } } }
        });
        return data.map(d => new Post(d.id, d.authorId, d.title, d.content, d.createdAt, d.likes, d.likedBy, d.author?.name, (d.comments as any[]) || []));
    }

    async findByAuthorId(authorId: string): Promise<Post[]> {
        const data = await prisma.post.findMany({ 
            where: { authorId },
            include: { author: { select: { name: true } } }
        });
        return data.map(d => new Post(d.id, d.authorId, d.title, d.content, d.createdAt, d.likes, d.likedBy, d.author?.name, (d.comments as any[]) || []));
    }

    async save(entity: Post): Promise<Post> {
        // If the ID is not a 24-char hex string, it's a new UUID from our service layer, so we skip the check and create.
        const id = entity.getId();
        const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);

        let existing = null;
        if (isMongoId) {
            existing = await prisma.post.findUnique({ where: { id } });
        }

        if (existing) {
            const data = await prisma.post.update({
                where: { id },
                data: { likes: entity.getLikes(), likedBy: entity.getLikedBy(), title: entity.getTitle(), content: entity.getContent(), comments: entity.getComments() }
            });
            return new Post(data.id, data.authorId, data.title, data.content, data.createdAt, data.likes, data.likedBy, undefined, (data.comments as any[]) || []);
        } else {
            const data = await prisma.post.create({
                data: {
                    title: entity.getTitle(),
                    content: entity.getContent(),
                    likes: entity.getLikes(),
                    createdAt: entity.getCreatedAt(),
                    comments: entity.getComments(),
                    author: {
                        connect: { id: entity.getAuthorId() }
                    }
                }
            });
            return new Post(data.id, data.authorId, data.title, data.content, data.createdAt, data.likes, data.likedBy, undefined, (data.comments as any[]) || []);
        }
    }

    async update(id: string, entity: Post): Promise<Post | null> {
        return this.save(entity); // Handled logically via upsert
    }

    async delete(id: string): Promise<boolean> {
        await prisma.post.delete({ where: { id }});
        return true;
    }
}
