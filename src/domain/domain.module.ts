import { Module } from '@nestjs/common';

import { EntityModule } from './entity/entity.module';
import { ManagementModule } from './management/management.module';

@Module({
  imports: [EntityModule, ManagementModule],
  exports: [EntityModule, ManagementModule],
})
export class DomainModule {}
