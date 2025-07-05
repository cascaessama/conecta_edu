import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { PortalService } from '../services/portal.service';
import { IPosts } from '../schemas/models/posts.interface';
import { z } from 'zod';
import { ZodValidationPipe } from 'src/shared/pipe/zod-validation.pipe';
// import { LoggingInterceptor } from 'src/shared/interceptors/logging.interceptor';
// import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

const createPostsSchema = z.object({
  titulo: z.string(),
  conteudo: z.string(),
  dataCriacao: z.coerce.date(),
  autor: z.string(),
});
type CreatedPosts = z.infer<typeof createPostsSchema>;

// @ApiTags('stock')
// @UseInterceptors(LoggingInterceptor)
@Controller('portal')
export class PortalController {
  constructor(private readonly portalService: PortalService) {}

  @Get()
  async getAllPosts(
    @Query('limit') limit: number,
    @Query('page') page: number,
  ) {
    return this.portalService.getAllPosts(limit, page);
  }

  @Get(':id')
  async getPosts(@Param('id') id: string) {
    return this.portalService.getPosts(id);
  }

//   @ApiBearerAuth()
  @UsePipes(new ZodValidationPipe(createPostsSchema))
  @Post()
  async createPosts(@Body() { titulo, conteudo, dataCriacao, autor }: CreatedPosts) {
    return this.portalService.createPosts({ titulo, conteudo, dataCriacao, autor });
  }

  @Put(':id')
  async updatePosts(
    @Param('id') id: string,
    @Body() posts: IPosts,
  ) {
    return this.portalService.updatePosts(id, posts);
  }

  @Delete(':id')
  async deletePosts(@Param('id') id: string) {
    return this.portalService.deletePosts(id);
  }
}