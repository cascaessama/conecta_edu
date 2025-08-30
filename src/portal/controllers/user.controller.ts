import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { RegisterUserDto } from '../dto/register-user.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto): Promise<{ message: string }> {
    const { username, password } = registerUserDto;
    await this.userService.register(username, password);
    return { message: 'User registered successfully' };
  }

  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.authService.validateUser(username, password);
    return this.authService.login(user);
  }
}
