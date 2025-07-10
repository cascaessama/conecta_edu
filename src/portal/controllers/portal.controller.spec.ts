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

  it('deve retornar todos os posts', async () => {
    (service.getAllPosts as jest.Mock).mockResolvedValue(['post1']);
    expect(await controller.getAllPosts(10, 1)).toEqual(['post1']);
  });

  it('deve retornar um post pelo id', async () => {
    (service.getPosts as jest.Mock).mockResolvedValue({ id: '1' });
    expect(await controller.getPosts('1')).toEqual({ id: '1' });
  });

  it('deve lançar NotFoundException se o post não for encontrado', async () => {
    (service.getPosts as jest.Mock).mockRejectedValue(new NotFoundException());
    await expect(controller.getPosts('1')).rejects.toThrow(NotFoundException);
  });

  it('deve criar um post', async () => {
    (service.createPosts as jest.Mock).mockResolvedValue(undefined);
    await expect(controller.createPosts({} as any)).resolves.toBeUndefined();
  });

  it('deve atualizar um post', async () => {
    (service.updatePosts as jest.Mock).mockResolvedValue(undefined);
    await expect(controller.updatePosts('1', {} as any)).resolves.toBeUndefined();
  });

  it('deve deletar um post', async () => {
    (service.deletePosts as jest.Mock).mockResolvedValue(undefined);
    await expect(controller.deletePosts('1')).resolves.toBeUndefined();
  });

  it('deve buscar posts', async () => {
    (service.searchPosts as jest.Mock).mockResolvedValue(['post1']);
    expect(await controller.searchPosts('query')).toEqual(['post1']);
  });
});
