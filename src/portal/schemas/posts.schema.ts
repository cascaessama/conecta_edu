import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IPosts } from './models/posts.interface';
import mongoose, { HydratedDocument } from 'mongoose';

export type PostsDocument = HydratedDocument<Posts>;

@Schema()
export class Posts implements IPosts {
    @Prop({ type: mongoose.Schema.Types.ObjectId })
    id?: string;
    @Prop()
    titulo: string;
    @Prop()
    conteudo: string;
    @Prop()
    dataCriacao: Date;
    @Prop()
    autorId: string;
}

export const PostsSchema = SchemaFactory.createForClass(Posts);