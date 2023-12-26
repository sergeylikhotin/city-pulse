import { Module } from '@nestjs/common';

import { BusinessModule } from '../business/business.module';
import { ProductModule } from '../product/product.module';
import { BankingModule } from '../banking/banking.module';

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
