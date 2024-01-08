import { Module } from '@nestjs/common';
import { ContractTermsService } from './contract-terms.service';

@Module({
  providers: [ContractTermsService],
  exports: [ContractTermsService],
})
export class ContractTermsModule {}
