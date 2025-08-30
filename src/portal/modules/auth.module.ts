import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { UserRepository } from '../repositories/user.repository';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { UserController } from '../controllers/user.controller';
import { JwtStrategy } from '../strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'your_jwt_secret', // Use a secure secret in production
      signOptions: { expiresIn: '1h' },
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // Registrando o esquema User
  ],
  controllers: [UserController],
  providers: [AuthService, UserService, UserRepository, JwtStrategy],
})
export class AuthModule {}
