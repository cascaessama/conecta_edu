import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsRepository } from './repositories/posts.repository';
import { PostsMongooseRepository } from './repositories/mongoose/posts.mongoose.repository';
import { PortalService } from './services/portal.service';
import { PortalController } from './controllers/portal.controller';
import { Posts, PostsSchema } from './schemas/posts.schema';
import { PrometheusService } from 'src/shared/services/prometheus.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Posts.name,
                schema: PostsSchema,
            },
        ]),
    ],
  providers: [
    {
      provide: PostsRepository,
      useClass: PostsMongooseRepository,
    },
    PortalService,
    PrometheusService
  ],
  controllers: [PortalController],
})
export class PortalModule {}
