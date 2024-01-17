import { Module } from '@nestjs/common';

import { EntityModule } from '../../entity/entity.module';
import { BusinessManagementService } from './business-management.service';

@Module({
  imports: [EntityModule],
  providers: [BusinessManagementService],
  exports: [BusinessManagementService],
})
export class BusinessManagementModule {}
