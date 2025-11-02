import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserType } from './models/user-type.enum';

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  // Tipo de usuário (ex.: admin, teacher, student). Obrigatório.
  @Prop({ required: true, enum: Object.values(UserType) })
  userType: UserType;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
