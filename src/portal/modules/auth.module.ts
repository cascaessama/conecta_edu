import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { UserRepository } from '../repositories/user.repository';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { UserController } from '../controllers/user.controller';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Module({
  imports: [
    PassportModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // Registrando o esquema User
  ],
  controllers: [UserController],
  providers: [
    AuthService,
    UserService,
    UserRepository,
    JwtStrategy,
    RolesGuard,
    JwtAuthGuard,
  ],
})
export class AuthModule {}
