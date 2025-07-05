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
// import { z } from 'zod';
// import { ZodValidationPipe } from 'src/shared/pipe/zod-validation.pipe';
// import { LoggingInterceptor } from 'src/shared/interceptors/logging.interceptor';
// import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

// const createStockSchema = z.object({
//   name: z.string(),
//   quantity: z.coerce.number(),
//   relationId: z.string(),
// });

// const updateStockSchema = z.object({
//   stock: z.coerce.number(),
// });

// type CreateStock = z.infer<typeof createStockSchema>;
// type UpdateStock = z.infer<typeof updateStockSchema>;

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
  async getPosts(@Param('productId') productId: string) {
    return this.portalService.getPosts(productId);
  }

//   @ApiBearerAuth()
//   @UsePipes(new ZodValidationPipe(createStockSchema))
  @Post()
  async createPosts(@Body() posts: IPosts) {
    return this.portalService.createPosts(posts);
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