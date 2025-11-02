import { ConflictException } from '@nestjs/common';
import { UserService } from './user.service';
import { UserType } from '../schemas/models/user-type.enum';

const mockUserRepository = () => ({
  findByUsername: jest.fn(),
  createUser: jest.fn(),
  findAllPaginated: jest.fn(),
  searchUsers: jest.fn(),
});

describe('UserService', () => {
  let service: UserService;
  let userRepository: ReturnType<typeof mockUserRepository>;

  beforeEach(() => {
    userRepository = mockUserRepository();
    service = new UserService(userRepository as any);
  });

  describe('register', () => {
    it('should throw ConflictException when username already exists', async () => {
      userRepository.findByUsername.mockResolvedValue({
        id: '1',
        username: 'john',
      });

      await expect(
        service.register('john', 'secret', UserType.Teacher),
      ).rejects.toBeInstanceOf(ConflictException);

      await expect(
        service.register('john', 'secret', UserType.Teacher),
      ).rejects.toThrow('Usuário já cadastrado');

      expect(userRepository.createUser).not.toHaveBeenCalled();
    });

    it('should propagate unique index error as ConflictException', async () => {
      userRepository.findByUsername.mockResolvedValue(null);
      userRepository.createUser.mockRejectedValue({ code: 11000 });

      await expect(
        service.register('john', 'secret', UserType.Teacher),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('should create user when not existing', async () => {
      userRepository.findByUsername.mockResolvedValue(null);
      userRepository.createUser.mockResolvedValue({ id: '2' });

      await expect(
        service.register('maria', 'secret', UserType.Admin),
      ).resolves.toBeUndefined();

      expect(userRepository.createUser).toHaveBeenCalled();
    });
  });

  describe('searchUsers', () => {
    it('should delegate to repository and return results', async () => {
      const expected = [
        { id: '1', username: 'john', userType: UserType.Teacher },
        { id: '2', username: 'maria', userType: UserType.Admin },
      ];
      userRepository.searchUsers.mockResolvedValue(expected);

      const result = await service.searchUsers('jo');
      expect(userRepository.searchUsers).toHaveBeenCalledWith('jo');
      expect(result).toEqual(expected);
    });
  });
});
