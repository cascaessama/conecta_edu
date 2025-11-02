import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { UserType } from '../schemas/models/user-type.enum';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(
    username: string,
    password: string,
    userType: UserType,
  ): Promise<User> {
    const newUser = new this.userModel({ username, password, userType });
    return newUser.save();
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async findAllPaginated(limit: number, page: number): Promise<User[]> {
    const safeLimit = Number(limit) > 0 ? Number(limit) : 10;
    const safePage = Number(page) > 0 ? Number(page) : 1;
    const offset = (safePage - 1) * safeLimit;

    // Nunca retornar o hash da senha
    return this.userModel
      .find({}, { password: 0 })
      .skip(offset)
      .limit(safeLimit)
      .exec();
  }

  async searchUsers(query: string): Promise<User[]> {
    const regex = { $regex: query, $options: 'i' };
    // Busca por username e userType; nunca retornar hash da senha
    return this.userModel
      .find(
        { $or: [{ username: regex }, { userType: regex }] },
        { password: 0 },
      )
      .exec();
  }

  async deleteUser(userId: string): Promise<void> {
    await this.userModel.deleteOne({ _id: userId }).exec();
  }

  async updateUser(
    userId: string,
    update: Partial<User>,
  ): Promise<void> {
    await this.userModel.updateOne({ _id: userId }, { $set: update }).exec();
  }

  async findById(userId: string): Promise<User | null> {
    // Nunca retornar o hash da senha
    return this.userModel.findById(userId, { password: 0 }).exec();
  }
}
