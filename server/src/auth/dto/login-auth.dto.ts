import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './create-auth.dto';
import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  email!: string;

  @IsString()
  password!: string;
}
