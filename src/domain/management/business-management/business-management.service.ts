import { Injectable } from '@nestjs/common';

import { AssetsLoaderService } from '../../../infrastructure/assets-loader/assets-loader.service';

import { BusinessEntity } from '../../entity/business.entity';
import { BusinessBankingEntity } from '../../entity/business-banking.entity';
import { ProductEntity } from '../../entity/product.entity';

import { PlayerBusiness } from './types/player-business';
import { GrammyUserError } from '@grammy/grammy.user-error';
import { Business, BusinessBankAccount, Product } from '@prisma/client';

@Injectable()
export class BusinessManagementService {
  constructor(
    private readonly businessEntity: BusinessEntity,
    private readonly productEntity: ProductEntity,
    private readonly businessBankingEntity: BusinessBankingEntity,
    private readonly assetsLoaderService: AssetsLoaderService,
  ) {}

  async debugCreateBusiness(playerId: string, type: string) {
    const asset = this.assetsLoaderService.getBusinessAsset(type);
    if (asset == null) {
      throw new Error(`No ${type} business asset found.`);
    }

    const business = await this.businessEntity.createBusiness({
      ownerId: playerId,
      type,
      name: '',
    });

    await this.productEntity.createBusinessProducts(
      business.id,
      asset.products,
    );
    await this.businessBankingEntity.createBankAccount(business.id);

    return business;
  }

  private businessToPlayerBusiness = (
    business: Business & { products: Product[]; account: BusinessBankAccount },
  ): PlayerBusiness => ({
    ...business,
    asset: this.assetsLoaderService.getBusinessAsset(business.type),

    products: business.products.map((product) => ({
      ...product,
      asset: this.assetsLoaderService.getProductAsset(product.type),
    })),
  });

  async getPlayerBusiness(
    playerId: string,
    businessId: string,
  ): Promise<PlayerBusiness> {
    const business = await this.businessEntity.getBusiness(businessId);
    if (business.ownerId !== playerId) {
      throw new GrammyUserError(
        'Вы не можете получить данные о бизнесе который Вам не принадлежит. Информация была передана администратору.',
      );
    }

    return this.businessToPlayerBusiness(business);
  }

  async getPlayerBusinesses(playerId: string): Promise<PlayerBusiness[]> {
    const businesses =
      await this.businessEntity.getBusinessesByPlayer(playerId);

    return businesses.map((business) =>
      this.businessToPlayerBusiness(business),
    );
  }
}
