import { Module } from '@nestjs/common';
import { MarketManagementService } from './market-management.service';
import { EntityModule } from '../../entity/entity.module';

@Module({
  imports: [EntityModule],
  providers: [MarketManagementService],
})
export class MarketManagementModule {}
