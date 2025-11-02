import { Injectable, NotFoundException } from '@nestjs/common';
import { PostsRepository } from '../repositories/posts.repository';
import { IPosts } from '../schemas/models/posts.interface';

@Injectable()
export class PortalService {
  constructor(private readonly postsRepository: PostsRepository) {}

  async getAllPosts(limit: number, page: number) {
    return this.postsRepository.getAllPosts(limit, page);
  }

  async getPosts(id: string) {
    const posts = await this.postsRepository.getPosts(id);
    if (!posts)
      throw new NotFoundException('Post não encontrado na base de dados');
    return posts;
  }

  async searchPosts(query: string) {
    return this.postsRepository.searchPosts(query);
  }

  async createPosts(posts: IPosts) {
    return this.postsRepository.createPosts(posts);
  }

  async updatePosts(id: string, posts: IPosts) {
    return this.postsRepository.updatePosts(id, posts);
  }

  async deletePosts(id: string) {
    return this.postsRepository.deletePosts(id);
  }
}
