import { Module } from '@nestjs/common';
import { ContractTermsManagementService } from './contract-terms-management.service';
import { EntityModule } from '../../entity/entity.module';

@Module({
  imports: [EntityModule],
  providers: [ContractTermsManagementService],
})
export class ContractTermsManagementModule {}
