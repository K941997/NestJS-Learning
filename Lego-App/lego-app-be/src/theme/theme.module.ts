import { Module } from '@nestjs/common';
import { ThemeService } from './theme.service';
import { ThemeController } from './theme.controller';
import { ThemeAdminController } from './controllers/admin/theme-admin.controller';
import { ThemeClientController } from './controllers/client/theme-client.controller';
import { ThemeClientService } from './services/client/theme-client.service';
import { ThemeAdminService } from './services/admin/theme-admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThemeEntity } from './entities/theme.entity';
import { ThemeRepository } from './repositories/theme.repository';
import { ProductRepository } from '../product/repositories/product.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ThemeEntity])],
  controllers: [ThemeAdminController, ThemeClientController],
  providers: [
    ThemeAdminService,
    ThemeClientService,
    ThemeRepository,
    ProductRepository,
  ],
})
export class ThemeModule {}
