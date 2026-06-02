import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';
export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  last_name?: string;

  @IsString()
  @IsOptional()
  avatar_utl?: string;

  @IsString()
  @IsOptional()
  google_id?: string;

  @IsString()
  @IsOptional()
  current_hashed_refresh_token?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole; // Allows admins to change user roles safely
}
