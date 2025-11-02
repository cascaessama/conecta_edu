import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '../schemas/models/user-type.enum';

export class RegisterUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @ApiProperty({ enum: UserType, enumName: 'UserType' })
  @IsEnum(UserType)
  userType: UserType;
}
