import { v4 as uuidv4 } from 'uuid';
import { IPostRepository } from '../domain/repositories/IPostRepository';
import { Post } from '../domain/entities/Post';

export class PostService {
    private postRepository: IPostRepository;

    constructor(postRepository: IPostRepository) {
        this.postRepository = postRepository;
    }

    async createPost(authorId: string, title: string, content: string): Promise<Post> {
        const post = new Post(uuidv4(), authorId, title, content);
        return await this.postRepository.save(post);
    }

    async getAllPosts(): Promise<Post[]> {
        return await this.postRepository.findAllOrderedByDate();
    }

    async likePost(postId: string, userId: string): Promise<Post> {
        const post = await this.postRepository.findById(postId);
        if (!post) throw new Error('Post not found');
        post.toggleLike(userId);
        return await this.postRepository.save(post);
    }
}
