import { Module } from '@nestjs/common';
import { MarketManagementService } from './market-management.service';
import { MarketModule } from '../../data-modules/market/market.module';
import { ContractChatModule } from '../../data-modules/contract-chat/contract-chat.module';

@Module({
  imports: [MarketModule, ContractChatModule],
  providers: [MarketManagementService],
})
export class MarketManagementModule {}
