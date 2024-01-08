import { Module } from '@nestjs/common';
import { ContractTermsManagementService } from './contract-terms-management.service';
import { ContractTermsModule } from '../../data-modules/contract-terms/contract-terms.module';

@Module({
  imports: [ContractTermsModule],
  providers: [ContractTermsManagementService],
})
export class ContractTermsManagementModule {}
