import { Module } from "@nestjs/common";

import { PlayerEntity } from "./player.entity";
import { PlayerPlugin } from "./player.plugin";

import { BankingEntity } from "./banking.entity";
import { PlayerBankingEntity } from "./player-banking.entity";
import { BusinessBankingEntity } from "./business-banking.entity";

import { BusinessEntity } from "./business.entity";
import { ProductEntity } from "./product.entity";
import { MarketEntity } from "./market.entity";
import { ContractEntity } from "./contract.entity";
import { ContractTermsEntity } from "./contract-terms.entity";
import { ContractChatEntity } from "./contract-chat.entity";

@Module({
  providers: [
    PlayerEntity,
    PlayerPlugin,

    BankingEntity,
    PlayerBankingEntity,
    BusinessBankingEntity,

    BusinessEntity,
    ProductEntity,

    MarketEntity,
    ContractEntity,
    ContractTermsEntity,
    ContractChatEntity
  ],
  exports: [
    PlayerEntity,
    PlayerPlugin,

    BankingEntity,
    PlayerBankingEntity,
    BusinessBankingEntity,

    BusinessEntity,
    ProductEntity,

    MarketEntity,
    ContractEntity,
    ContractTermsEntity,
    ContractChatEntity
  ]
})
export class EntityModule {
}
