import { Module } from '@nestjs/common';
import { ContractChatService } from './contract-chat.service';
import { ContractModule } from '../contract/contract.module';
import { ContractTermsModule } from '../contract-terms/contract-terms.module';

@Module({
  imports: [ContractModule, ContractTermsModule],
  providers: [ContractChatService],
  exports: [ContractChatService],
})
export class ContractChatModule {}
