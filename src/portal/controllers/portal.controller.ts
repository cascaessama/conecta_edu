import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { PortalService } from '../services/portal.service';
import { IPosts } from '../schemas/models/posts.interface';
import { z } from 'zod';
import { ZodValidationPipe } from '../../shared/pipe/zod-validation.pipe';
import { LoggingInterceptor } from '../../shared/interceptors/logging.interceptor';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { UserType } from '../schemas/models/user-type.enum';

const createPostsSchema = z.object({
  titulo: z.string(),
  conteudo: z.string(),
  dataCriacao: z.coerce.date(),
  autor: z.string(),
});
type CreatedPosts = z.infer<typeof createPostsSchema>;

ApiTags('portal');
@UseInterceptors(LoggingInterceptor)
@Controller('portal')
export class PortalController {
  constructor(private readonly portalService: PortalService) {}

  @Get()
  async getAllPosts(
    @Query('limit') limit: number,
    @Query('page') page: number,
  ) {
    const posts = await this.portalService.getAllPosts(limit, page);
    if (!posts || posts.length === 0) {
      return { message: 'Não há post cadastrados na base de dados' };
    }
    return posts;
  }

  @Get('search')
  async searchPosts(@Query('query') query: string) {
    if (!query) throw new BadRequestException('Query param is required');
    const result = await this.portalService.searchPosts(query);
    if (!result || result.length === 0) {
      return {
        message: `Busca nos campos 'Título' e 'Conteúdo' não encontrou resultados com a palavra <${query}>`,
      };
    }
    return result;
  }

  @Get(':id')
  async getPosts(@Param('id') id: string) {
    return this.portalService.getPosts(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.Admin, UserType.Teacher)
  @UsePipes(new ZodValidationPipe(createPostsSchema))
  @Post()
  async createPosts(
    @Body() { titulo, conteudo, dataCriacao, autor }: CreatedPosts,
  ) {
    await this.portalService.createPosts({
      titulo,
      conteudo,
      dataCriacao,
      autor,
    });
    return { message: 'Post criado com sucesso!' };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.Admin, UserType.Teacher)
  @Put(':id')
  async updatePosts(@Param('id') id: string, @Body() posts: IPosts) {
    await this.portalService.updatePosts(id, posts);
    return { message: 'Post atualizado com sucesso!' };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.Admin, UserType.Teacher)
  @Delete(':id')
  async deletePosts(@Param('id') id: string) {
    await this.portalService.deletePosts(id);
    return { message: 'Post excluído com sucesso!' };
  }
}
