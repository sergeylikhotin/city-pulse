import { Module } from '@nestjs/common';

import { PlayerManagementModule } from './player-management/player-management.module';
import { BusinessManagementModule } from './business-management/business-management.module';
import { MarketManagementModule } from './market-management/market-management.module';
import { ContractChatManagementModule } from './contract-chat-management/contract-chat-management.module';
import { ContractTermsManagementModule } from './contract-terms-management/contract-terms-management.module';

@Module({
  imports: [
    PlayerManagementModule,
    BusinessManagementModule,
    MarketManagementModule,
    ContractChatManagementModule,
    ContractTermsManagementModule,
  ],
  exports: [
    PlayerManagementModule,
    BusinessManagementModule,
    MarketManagementModule,
    ContractChatManagementModule,
    ContractTermsManagementModule,
  ],
})
export class ManagementModule {}
