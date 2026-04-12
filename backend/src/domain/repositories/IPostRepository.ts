import { Post } from '../entities/Post';
import { IRepository } from './IRepository';

export interface IPostRepository extends IRepository<Post> {
    findAllOrderedByDate(): Promise<Post[]>;
    findByAuthorId(authorId: string): Promise<Post[]>;
}
