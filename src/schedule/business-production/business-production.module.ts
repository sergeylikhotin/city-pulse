import { Module } from '@nestjs/common';
import { BusinessProductionService } from './business-production.service';
import { BusinessModule } from '../../data-modules/business/business.module';
import { ProductModule } from '../../data-modules/product/product.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot(), BusinessModule, ProductModule],
  providers: [BusinessProductionService],
})
export class BusinessProductionModule {}
