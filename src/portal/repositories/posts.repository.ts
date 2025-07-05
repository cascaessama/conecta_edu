import { IPosts } from "../schemas/models/posts.interface";

export abstract class PostsRepository {
  abstract getAllPosts(limit: number, page: number): Promise<IPosts[]>;
  abstract getPosts(postsId: string): Promise<IPosts | null>;
  abstract createPosts(posts: IPosts): Promise<void>;
  abstract updatePosts(id: string, posts: IPosts): Promise<void>;
  abstract deletePosts(id: string): Promise<void>;
}