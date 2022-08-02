import { Injectable, ConflictException } from '@nestjs/common';
import { CategoryRepository } from './../../repositories/category.repository';
import slug from 'slug';
import { CreateCategoryAdminDto } from './../../dtos/admin/create-category-admin.dto';
import { CategoryEntity } from '../../../category/entities/category.entity';

@Injectable()
export class CategoryAdminService {
  constructor(private categoryRepository: CategoryRepository) {}

  slugify(key: string) {
    return slug(key, { lower: true }).toString();
  }

  //!CREATE Category Admin:
  async createCategoryAdmin(
    createCategoryAdminDto: CreateCategoryAdminDto,
  ): Promise<CategoryEntity> {
    const { key, name, image, description, enabled, productKeys } =
      createCategoryAdminDto;

    const existCategory = await this.categoryRepository.findOneBy({ key: key });
    if (existCategory) {
      throw new ConflictException(`Duplicate Category`);
    }

    
    return;
  }
}
