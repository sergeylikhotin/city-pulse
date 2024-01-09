import { Module } from '@nestjs/common';
import { ContractChatManagementService } from './contract-chat-management.service';
import { EntityModule } from '../../entity/entity.module';

@Module({
  imports: [EntityModule],
  providers: [ContractChatManagementService],
  exports: [ContractChatManagementService],
})
export class ContractChatManagementModule {}
