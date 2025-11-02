import { Controller, Post, Body, UseGuards, Get, Query } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { RegisterUserDto } from '../dto/register-user.dto';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UserType } from '../schemas/models/user-type.enum';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.Teacher, UserType.Admin)
  async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<{ message: string }> {
    const { username, password, userType } = registerUserDto;
    await this.userService.register(username, password, userType);
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

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.Teacher, UserType.Admin)
  async getAllUsers(
    @Query('limit') limit: number,
    @Query('page') page: number,
  ) {
    const users = await this.userService.getAllUsers(limit, page);
    if (!users || users.length === 0) {
      return { message: 'Não há usuários cadastrados na base de dados' };
    }
    return users;
  }
}
