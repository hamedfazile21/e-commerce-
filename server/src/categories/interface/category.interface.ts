export interface SubCategoryDto {
  id: number;
  name: string;
  slug: string;
  icon: string;
}

export interface CategoryResponseDto {
  id: number;
  name: string;
  slug: string;
  icon: string;
  sub_categories: SubCategoryDto[]; // Array of single-level step-children
  created_at : string,
  updated_at : string
}
