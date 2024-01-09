import { Module } from "@nestjs/common";

import { EntityModule } from "./entity/entity.module";
import { PlayerManagementModule } from "./managment/player-management/player-management.module";
import { BusinessManagementModule } from "./managment/business-management/business-management.module";
import { MarketManagementModule } from "./managment/market-management/market-management.module";
import { ContractChatManagementModule } from "./managment/contract-chat-management/contract-chat-management.module";
import { ContractTermsManagementModule } from "./managment/contract-terms-management/contract-terms-management.module";

@Module({
  imports: [
    EntityModule,

    PlayerManagementModule,
    BusinessManagementModule,
    MarketManagementModule,
    ContractChatManagementModule,
    ContractTermsManagementModule
  ]
})
export class DomainModule {
}
