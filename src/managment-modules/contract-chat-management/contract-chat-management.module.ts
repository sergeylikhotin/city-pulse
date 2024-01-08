import { Module } from '@nestjs/common';
import { ContractChatManagementService } from './contract-chat-management.service';
import { ContractModule } from '../../data-modules/contract/contract.module';
import { ContractChatModule } from '../../data-modules/contract-chat/contract-chat.module';

@Module({
  imports: [ContractModule, ContractChatModule],
  providers: [ContractChatManagementService],
  exports: [ContractChatManagementService],
})
export class ContractChatManagementModule {}
