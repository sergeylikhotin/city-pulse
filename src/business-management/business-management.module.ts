import { Module } from '@nestjs/common';
import { BusinessManagementService } from './business-management.service';

@Module({
  providers: [BusinessManagementService]
})
export class BusinessManagementModule {}
