import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import * as bcrypt from 'bcrypt';
import { UserType } from '../schemas/models/user-type.enum';

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
}
