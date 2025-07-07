import { Test, TestingModule } from '@nestjs/testing';
import { PortalService } from './portal.service';
import { PostsRepository } from '../repositories/posts.repository';
import { NotFoundException } from '@nestjs/common';

describe('PortalService', () => {
  let service: PortalService;
  let repository: Partial<PostsRepository>;

  beforeEach(async () => {
    repository = {
      getAllPosts: jest.fn(),
      getPosts: jest.fn(),
      createPosts: jest.fn(),
      updatePosts: jest.fn(),
      deletePosts: jest.fn(),
      searchPosts: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PortalService,
        { provide: PostsRepository, useValue: repository },
      ],
    }).compile();

    service = module.get<PortalService>(PortalService);
  });

  it('should return all posts', async () => {
    (repository.getAllPosts as jest.Mock).mockResolvedValue(['post1']);
    expect(await service.getAllPosts(10, 1)).toEqual(['post1']);
  });

  it('should return a post by id', async () => {
    (repository.getPosts as jest.Mock).mockResolvedValue({ id: '1' });
    expect(await service.getPosts('1')).toEqual({ id: '1' });
  });

  it('should throw NotFoundException if post not found', async () => {
    (repository.getPosts as jest.Mock).mockResolvedValue(null);
    await expect(service.getPosts('1')).rejects.toThrow(NotFoundException);
  });

  it('should create a post', async () => {
    (repository.createPosts as jest.Mock).mockResolvedValue(undefined);
    await expect(service.createPosts({} as any)).resolves.toBeUndefined();
  });

  it('should update a post', async () => {
    (repository.updatePosts as jest.Mock).mockResolvedValue(undefined);
    await expect(service.updatePosts('1', {} as any)).resolves.toBeUndefined();
  });

  it('should delete a post', async () => {
    (repository.deletePosts as jest.Mock).mockResolvedValue(undefined);
    await expect(service.deletePosts('1')).resolves.toBeUndefined();
  });

  it('should search posts', async () => {
    (repository.searchPosts as jest.Mock).mockResolvedValue(['post1']);
    expect(await service.searchPosts('query')).toEqual(['post1']);
  });
});