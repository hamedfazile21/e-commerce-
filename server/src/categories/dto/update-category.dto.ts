import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  name!: string;

  @IsString()
  slug!: string;

  @IsString()
  icon!: string;

  @IsOptional()
  @IsInt()
  parent_id?: number | null;
}
