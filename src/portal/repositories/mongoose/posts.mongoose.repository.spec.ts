import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { PostsMongooseRepository } from './posts.mongoose.repository';
import { IPosts } from '../../schemas/models/posts.interface';

describe('PostsMongooseRepository', () => {
  let repository: PostsMongooseRepository;
  let saveMock: jest.Mock;
  let modelMock: any;

  beforeEach(async () => {
    saveMock = jest.fn().mockResolvedValue(undefined);

    // Mock do construtor do model
    modelMock = function () {
      return { save: saveMock };
    };
    // Métodos estáticos do model
    modelMock.find = jest.fn().mockReturnThis();
    modelMock.skip = jest.fn().mockReturnThis();
    modelMock.limit = jest.fn().mockReturnThis();
    modelMock.exec = jest.fn();
    modelMock.findById = jest.fn().mockReturnThis();
    modelMock.updateOne = jest.fn().mockReturnThis();
    modelMock.deleteOne = jest.fn().mockReturnThis();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsMongooseRepository,
        { provide: getModelToken('Posts'), useValue: modelMock },
      ],
    }).compile();

    repository = module.get<PostsMongooseRepository>(PostsMongooseRepository);
  });

  it('deve retornar todos os posts', async () => {
    modelMock.exec.mockResolvedValue(['post1']);
    expect(await repository.getAllPosts(10, 1)).toEqual(['post1']);
  });

  it('deve retornar um post pelo id', async () => {
    modelMock.exec.mockResolvedValue({ id: '1' });
    expect(await repository.getPosts('1')).toEqual({ id: '1' });
  });

  it('deve buscar posts', async () => {
    modelMock.exec.mockResolvedValue(['post1']);
    expect(await repository.searchPosts('query')).toEqual(['post1']);
  });

  it('deve criar um post', async () => {
    await expect(repository.createPosts({} as any)).resolves.toBeUndefined();
    expect(saveMock).toHaveBeenCalled();
  });

  it('deve atualizar um post', async () => {
    modelMock.exec.mockResolvedValue(undefined);
    await expect(
      repository.updatePosts('1', {} as any),
    ).resolves.toBeUndefined();
  });

  it('deve deletar um post', async () => {
    modelMock.exec.mockResolvedValue(undefined);
    await expect(repository.deletePosts('1')).resolves.toBeUndefined();
  });
});
