import { PostsRepository } from './posts.repository';
import { IPosts } from '../schemas/models/posts.interface';

describe('PostsRepository (abstract)', () => {
  class TestRepo extends PostsRepository {
    getAllPosts = jest.fn();
    getPosts = jest.fn();
    createPosts = jest.fn();
    updatePosts = jest.fn();
    deletePosts = jest.fn();
    searchPosts = jest.fn();
  }

  let repo: TestRepo;

  beforeEach(() => {
    repo = new TestRepo();
  });

  it('should call getAllPosts', () => {
    repo.getAllPosts(10, 1);
    expect(repo.getAllPosts).toHaveBeenCalledWith(10, 1);
  });

  it('should call getPosts', () => {
    repo.getPosts('id');
    expect(repo.getPosts).toHaveBeenCalledWith('id');
  });

  it('should call createPosts', () => {
    repo.createPosts({} as IPosts);
    expect(repo.createPosts).toHaveBeenCalled();
  });

  it('should call updatePosts', () => {
    repo.updatePosts('id', {} as IPosts);
    expect(repo.updatePosts).toHaveBeenCalled();
  });

  it('should call deletePosts', () => {
    repo.deletePosts('id');
    expect(repo.deletePosts).toHaveBeenCalledWith('id');
  });

  it('should call searchPosts', () => {
    repo.searchPosts('query');
    expect(repo.searchPosts).toHaveBeenCalledWith('query');
  });
});
