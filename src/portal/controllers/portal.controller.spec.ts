import { Test, TestingModule } from '@nestjs/testing';
import { PortalController } from './portal.controller';
import { PortalService } from '../services/portal.service';
import { NotFoundException } from '@nestjs/common';

describe('PortalController', () => {
  let controller: PortalController;
  let service: Partial<Record<keyof PortalService, jest.Mock>>;

  beforeEach(async () => {
    service = {
      getAllPosts: jest.fn(),
      getPosts: jest.fn(),
      createPosts: jest.fn(),
      updatePosts: jest.fn(),
      deletePosts: jest.fn(),
      searchPosts: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PortalController],
      providers: [
        { provide: PortalService, useValue: service },
      ],
    }).compile();

    controller = module.get<PortalController>(PortalController);
  });

  it('should return all posts', async () => {
    (service.getAllPosts as jest.Mock).mockResolvedValue(['post1']);
    expect(await controller.getAllPosts(10, 1)).toEqual(['post1']);
  });

  it('should return a post by id', async () => {
    (service.getPosts as jest.Mock).mockResolvedValue({ id: '1' });
    expect(await controller.getPosts('1')).toEqual({ id: '1' });
  });

  it('should throw NotFoundException if post not found', async () => {
    (service.getPosts as jest.Mock).mockRejectedValue(new NotFoundException());
    await expect(controller.getPosts('1')).rejects.toThrow(NotFoundException);
  });

  it('should create a post', async () => {
    (service.createPosts as jest.Mock).mockResolvedValue(undefined);
    await expect(controller.createPosts({} as any)).resolves.toBeUndefined();
  });

  it('should update a post', async () => {
    (service.updatePosts as jest.Mock).mockResolvedValue(undefined);
    await expect(controller.updatePosts('1', {} as any)).resolves.toBeUndefined();
  });

  it('should delete a post', async () => {
    (service.deletePosts as jest.Mock).mockResolvedValue(undefined);
    await expect(controller.deletePosts('1')).resolves.toBeUndefined();
  });

  it('should search posts', async () => {
    (service.searchPosts as jest.Mock).mockResolvedValue(['post1']);
    expect(await controller.searchPosts('query')).toEqual(['post1']);
  });
});
