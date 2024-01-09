import { Module } from "@nestjs/common";
import { BusinessProductionService } from "./business-production.service";
import { ScheduleModule } from "@nestjs/schedule";

import { EntityModule } from "../../entity/entity.module";

@Module({
  imports: [ScheduleModule.forRoot(), EntityModule],
  providers: [BusinessProductionService]
})
export class BusinessProductionModule {
}
