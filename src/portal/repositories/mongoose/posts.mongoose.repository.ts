import { IPosts} from 'src/portal/schemas/models/posts.interface';
import { PostsRepository } from '../posts.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Posts } from 'src/portal/schemas/posts.schema';
import { Model } from 'mongoose';

export class PostsMongooseRepository implements PostsRepository {
  constructor(
    @InjectModel(Posts.name) private postsModel: Model<Posts>,
  ) {}
  getallPosts(limit: number, page: number): Promise<IPosts[]> {
    throw new Error('Method not implemented.');
  }

  getAllPosts(limit: number, page: number): Promise<IPosts[]> {
    const offset = (page - 1) * limit;
    return this.postsModel.find().skip(offset).limit(limit).exec();
  }

  getPosts(postsId: string): Promise<IPosts | null> {
    return this.postsModel.findById(postsId).exec();
  }

  async createPosts(posts: IPosts): Promise<void> {
    const createPosts = new this.postsModel(posts);

    await createPosts.save();
  }

  async updatePosts(postsId: string, posts: IPosts): Promise<void> {
    await this.postsModel
      .updateOne({ _id: postsId }, { $set: posts })
      .exec();
  }

  async deletePosts(postsId: string): Promise<void> {
    await this.postsModel.deleteOne({ _id: postsId }).exec();
  }
}