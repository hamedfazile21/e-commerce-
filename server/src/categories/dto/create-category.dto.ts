import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
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
