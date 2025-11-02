import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Query,
  BadRequestException,
  Delete,
  Param,
  Put,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { RegisterUserDto } from '../dto/register-user.dto';
import { UpdateUserDto } from 'src/portal/dto/update-user.dto';
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

  @Get('search')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.Teacher, UserType.Admin)
  async searchUsers(@Query('query') query: string) {
    if (!query) throw new BadRequestException('Query param is required');
    const result = await this.userService.searchUsers(query);
    if (!result || result.length === 0) {
      return {
        message: `Busca nos campos 'Username' e 'UserType' não encontrou resultados com a palavra <${query}>`,
      };
    }
    return result;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.Teacher, UserType.Admin)
  async deleteUser(@Param('id') id: string) {
    await this.userService.deleteUser(id);
    return { message: 'Usuário excluído com sucesso!' };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.Teacher, UserType.Admin)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    await this.userService.updateUser(id, updateUserDto);
    return { message: 'Usuário atualizado com sucesso!' };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.Teacher, UserType.Admin)
  async getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }
}
