import { Test, TestingModule } from '@nestjs/testing';
import { PortalController } from './portal.controller';
import { PortalService } from '../services/portal.service';
import { NotFoundException } from '@nestjs/common';
import { AuthGuard } from '../../shared/guards/auth.guard';

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
        {
          provide: require('../../shared/services/prometheus.service')
            .PrometheusService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .overrideProvider(
        require('../../shared/services/prometheus.service').PrometheusService,
      )
      .useValue({})
      .compile();

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

  it('deve criar um post', async () => {
    (service.createPosts as jest.Mock).mockResolvedValue(undefined);
    const dto = {
      titulo: 'Novo Post',
      conteudo: 'Conteúdo',
      dataCriacao: new Date(),
      autor: 'Autor',
    };
    await expect(controller.createPosts(dto)).resolves.toEqual({
      message: 'Post criado com sucesso!',
    });
  });

  it('deve atualizar um post', async () => {
    (service.updatePosts as jest.Mock).mockResolvedValue(undefined);
    const post = {
      titulo: 'Atualizado',
      conteudo: 'Novo conteúdo',
      dataCriacao: new Date(),
      autor: 'Autor',
    };
    await expect(controller.updatePosts('1', post as any)).resolves.toEqual({
      message: 'Post atualizado com sucesso!',
    });
  });

  it('deve deletar um post', async () => {
    (service.deletePosts as jest.Mock).mockResolvedValue(undefined);
    await expect(controller.deletePosts('1')).resolves.toEqual({
      message: 'Post excluído com sucesso!',
    });
  });

  it('deve buscar posts', async () => {
    (service.searchPosts as jest.Mock).mockResolvedValue(['post1']);
    expect(await controller.searchPosts('query')).toEqual(['post1']);
  });

  it('deve retornar mensagem se não houver posts', async () => {
    (service.getAllPosts as jest.Mock).mockResolvedValue([]);
    expect(await controller.getAllPosts(10, 1)).toEqual({
      message: 'Não há post cadastrados na base de dados',
    });
  });

  it('deve retornar mensagem se busca não encontrar resultados', async () => {
    (service.searchPosts as jest.Mock).mockResolvedValue([]);
    expect(await controller.searchPosts('nada')).toEqual({
      message: `Busca nos campos 'Título' e 'Conteúdo' não encontrou resultados com a palavra <nada>`,
    });
  });
});
