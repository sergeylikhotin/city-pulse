import { Module } from '@nestjs/common';
import { BusinessProductionService } from './business-production.service';
import { BusinessModule } from '../business/business.module';
import { ProductModule } from '../product/product.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule, BusinessModule, ProductModule],
  providers: [BusinessProductionService],
})
export class BusinessProductionModule {}
