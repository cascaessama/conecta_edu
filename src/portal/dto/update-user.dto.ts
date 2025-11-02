import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserType } from '../schemas/models/user-type.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  username?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  password?: string;

  @IsOptional()
  @IsEnum(UserType)
  @ApiPropertyOptional({ enum: UserType, enumName: 'UserType' })
  userType?: UserType;
}
