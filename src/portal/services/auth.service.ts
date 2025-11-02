import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../repositories/user.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userRepository.findByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      // Ensure we return a plain object with enumerable properties
      const plain =
        typeof (user as any).toObject === 'function'
          ? (user as any).toObject()
          : (user as any);
      const { password: _pw, ...result } = plain;
      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: any): Promise<{ access_token: string }> {
    const payload = {
      username: user.username,
      sub: user._id,
      userType: user.userType,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
