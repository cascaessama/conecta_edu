import { Injectable, BadRequestException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async register(username: string, password: string): Promise<void> {
    if (!username || !password) {
      throw new BadRequestException('Username and password are required');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userRepository.createUser(username, hashedPassword);
  }
}
