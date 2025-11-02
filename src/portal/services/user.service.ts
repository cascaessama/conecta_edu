import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import * as bcrypt from 'bcrypt';
import { UserType } from '../schemas/models/user-type.enum';
import { User } from '../schemas/user.schema';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async register(
    username: string,
    password: string,
    userType: UserType,
  ): Promise<void> {
    if (!username || !password || !userType) {
      throw new BadRequestException(
        'Username, password and userType are required',
      );
    }

    // Verifica se o usuário já existe
    const existing = await this.userRepository.findByUsername(username);
    if (existing) {
      // 409 - conflito de recurso já existente
      throw new ConflictException('Usuário já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      await this.userRepository.createUser(username, hashedPassword, userType);
    } catch (err: unknown) {
      // Em caso de condição de corrida, captura erro de índice único do Mongo/Mongoose
      if (err && typeof err === 'object') {
        const obj = err as Record<string, unknown>;
        if (obj.code === 11000 || obj.name === 'MongoServerError') {
          throw new ConflictException('Usuário já cadastrado');
        }
      }
      throw err as Error;
    }
  }

  async getAllUsers(limit: number, page: number): Promise<User[]> {
    return this.userRepository.findAllPaginated(limit, page);
  }

  async searchUsers(query: string): Promise<User[]> {
    return this.userRepository.searchUsers(query);
  }

  async deleteUser(id: string): Promise<void> {
    return this.userRepository.deleteUser(id);
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<void> {
    if (!dto || Object.keys(dto).length === 0) {
      throw new BadRequestException('Nenhum dado para atualizar');
    }

    const update: Partial<User> = {};

    if (typeof dto.username !== 'undefined') {
      update.username = dto.username;
    }

    if (typeof dto.userType !== 'undefined') {
      update.userType = dto.userType;
    }

    if (typeof dto.password !== 'undefined') {
      update.password = await bcrypt.hash(dto.password, 10);
    }

    try {
      await this.userRepository.updateUser(id, update);
    } catch (err: unknown) {
      if (err && typeof err === 'object') {
        const obj = err as Record<string, unknown>;
        if (obj.code === 11000 || obj['name'] === 'MongoServerError') {
          throw new ConflictException('Usuário já cadastrado');
        }
      }
      throw err as Error;
    }
  }

  async getUserById(id: string): Promise<User | null> {
    if (!id) {
      throw new BadRequestException('Id é obrigatório');
    }
    return this.userRepository.findById(id);
  }
}
