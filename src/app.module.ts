import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PortalModule } from './portal/portal.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { AuthModule } from './portal/modules/auth.module';

@Module({
  imports: [
    PrometheusModule.register(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URL || ''),
    PortalModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'your_jwt_secret',
      signOptions: { expiresIn: '10m' },
    }),
    AuthModule, // Adicionando o AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
