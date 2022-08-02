/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from 'src/auth/interface/requestWithUser.interface';
import { JwtAuthGuard } from 'src/auth/utils/guard/jwtAuthGuard.guard';
import { CheckPolicies } from 'src/casl/casl-ability.decorator';
import { AppAbility, CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { Action } from 'src/casl/casl-action.enum';
import { PoliciesGuard } from 'src/casl/policiesGuard.guard';
// import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';
import { CategoriesService } from './categories.service';
import { CategoryEntity } from './entity/category.entity';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';

@Controller('categories') //localhost:3000/api/categories
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private caslAbilityFactory: CaslAbilityFactory //add Casl to Role + isCreator
  ) {}

  //!Create Category:
  @Post()
  @UseGuards(JwtAuthGuard)
  async createCategory(
    @Body() category: CreateCategoryDto,
    @Req() req: RequestWithUser, //!(Req after LogIn) use in CASL
    ) {
    const user = req.user;
    return this.categoriesService.createCategory(category, user);
  }

  //!Get All Categories:
  @Get()
  getAllCategories() {
    return this.categoriesService.getAllCategories();
  }

  //!Get Category By Id:
  @Get(':id')
  getPostById(@Param('id') id: string) {
    return this.categoriesService.getCategoryById(Number(id));
  }

  //!Update Category:
  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Req() req: RequestWithUser, //!(Req after LogIn) use in CASL
  ) {
    const user = req.user
    return this.categoriesService.updateCategory(Number(id), updateCategoryDto, user);
  }

  //!Delete Category By Id:
  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteCategory(
    @Param('id') id: string,
    @Req() req: RequestWithUser, //!(Req after LogIn) use in CASL
    ) {
      const user = req.user
      return this.categoriesService.deleteCategory(Number(id), user);
  }
}
