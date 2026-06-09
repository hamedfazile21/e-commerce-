import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CategoryResponseDto,
  SubCategoryDto,
} from './interface/category.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  validateCategory(id: number) {
    const currentCategory = this.categoryRepository.findOne({ where: { id } });
    if (!currentCategory) {
      return null;
    } else {
      return currentCategory;
    }
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const { parent_id, ...rest } = createCategoryDto;
    let validateParent_id: Category | null = null;
    if (parent_id) {
      validateParent_id = await this.validateCategory(parent_id);

      if (!validateParent_id) {
        throw new NotFoundException('Parent id not found');
      }
    }
    const newRecode = await this.categoryRepository.create({
      ...rest,
      parent_id: validateParent_id,
    });
    return await this.categoryRepository.save(newRecode);
  }

  async findAll(): Promise<CategoryResponseDto[]> {
    const allCategories: Category[] = await this.categoryRepository.find({
      relations: { parent_id: true },
    });

    const rootCategories: CategoryResponseDto[] = [];
    const childrenGroupedByParent = new Map<number, SubCategoryDto[]>();

    allCategories.forEach((cat: any) => {
      const hasParent = cat.parent_id !== null && cat.parent_id !== undefined;

      if (!hasParent) {
        rootCategories.push({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          icon: cat.icon,
          sub_categories: [],
          created_at: cat.created_at,
          updated_at: cat.updated_at,
        });
      } else {
        const parentIdNumber = cat.parent_id.id;

        const childItem: SubCategoryDto = {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          icon: cat.icon,
        };

        if (!childrenGroupedByParent.has(parentIdNumber)) {
          childrenGroupedByParent.set(parentIdNumber, []);
        }
        childrenGroupedByParent.get(parentIdNumber)!.push(childItem);
      }
    });

    rootCategories.forEach((parent) => {
      const children = childrenGroupedByParent.get(parent.id);
      if (children) {
        parent.sub_categories = children;
      }
    });

    return rootCategories;
  }

  async findOne(id: number) {
    const currentCategory = await this.validateCategory(id);

    if (!currentCategory) {
      throw new NotFoundException('Category Not Found');
    }
    return currentCategory;
  }

  // TODO : create a json object for all message
  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const { parent_id, ...rest } = updateCategoryDto;
    let validateParent_id: Category | null = null;
    const validateId = await this.validateCategory(id);
    if (parent_id) {
      validateParent_id = await this.validateCategory(parent_id);

      if (!validateParent_id) {
        throw new NotFoundException('Parent id not found');
      }
    }
    if (!validateId) {
      throw new NotFoundException('Category not found');
    }
    await this.categoryRepository.update(id, {
      name: rest.name,
      icon: rest.icon,
      slug: rest.slug,
      parent_id: validateParent_id,
    });
    return validateId;
  }

  async remove(id: number) {
    const deleteRow = await this.categoryRepository.delete({ id });
    console.log(deleteRow);
    if (deleteRow.affected === 0) {
      throw new NotFoundException('Category Not Found');
    }
    return { message: 'deleted' };
  }
}
