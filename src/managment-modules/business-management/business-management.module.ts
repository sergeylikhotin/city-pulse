import { Module } from '@nestjs/common';

import { BusinessModule } from '../../data-modules/business/business.module';
import { ProductModule } from '../../data-modules/product/product.module';
import { BankingModule } from '../../data-modules/banking/banking.module';

import { BusinessManagementService } from './business-management.service';

import { DebugCreateBusinessScene } from './scenes/debug-create-business.scene';
import { PlayerBusinessesScene } from './scenes/player-businesses.scene';

@Module({
  imports: [BusinessModule, ProductModule, BankingModule],
  providers: [
    BusinessManagementService,
    DebugCreateBusinessScene,
    PlayerBusinessesScene,
  ],
})
export class BusinessManagementModule {}
