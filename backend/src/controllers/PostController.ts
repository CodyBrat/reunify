import { Request, Response } from 'express';
import { PostService } from '../services/PostService';

export class PostController {
    private postService: PostService;

    constructor(postService: PostService) {
        this.postService = postService;
    }

    public createPost = async (req: Request, res: Response) => {
        try {
            const { authorId, title, content } = req.body;
            const post = await this.postService.createPost(authorId, title, content);
            res.status(201).json(post);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    public getPosts = async (req: Request, res: Response) => {
        try {
            const posts = await this.postService.getAllPosts();
            res.status(200).json(posts.map(p => ({
                id: p.getId(),
                authorId: p.getAuthorId(),
                authorName: p.getAuthorName(),
                title: p.getTitle(),
                content: p.getContent(),
                createdAt: p.getCreatedAt(),
                likes: p.getLikes(),
                likedBy: p.getLikedBy(),
                comments: p.getComments()
            })));
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    public likePost = async (req: Request, res: Response) => {
        try {
            const { postId } = req.params;
            const { userId } = req.body;
            const post = await this.postService.likePost(postId as string, userId);
            res.status(200).json(post);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    public commentPost = async (req: Request, res: Response) => {
        try {
            const { postId } = req.params;
            const { authorId, authorName, content } = req.body;
            const post = await this.postService.commentPost(postId as string, authorId, authorName, content);
            res.status(200).json(post);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
