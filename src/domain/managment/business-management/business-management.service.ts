import { Injectable } from '@nestjs/common';

import { AssetsLoaderService } from '../../../infrastructure/assets-loader/assets-loader.service';

import { BusinessEntity } from '../../entity/business.entity';
import { BusinessBankingEntity } from '../../entity/business-banking.entity';
import { ProductEntity } from '../../entity/product.entity';

import { PlayerBusiness } from './types/player-business';

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

    const business = await this.businessEntity.createBusiness(playerId, type);

    await this.productEntity.createBusinessProducts(
      business.id,
      asset.products,
    );
    await this.businessBankingEntity.createBankAccount(business.id);

    return business;
  }

  async getPlayerBusinesses(playerId: string): Promise<PlayerBusiness[]> {
    const businesses =
      await this.businessEntity.getBusinessesByPlayer(playerId);

    return businesses.map((business) => {
      const asset = this.assetsLoaderService.getBusinessAsset(business.type);

      return {
        ...business,
        asset,

        products: business.products.map((product) => {
          const asset = this.assetsLoaderService.getProductAsset(product.type);

          return {
            ...product,
            asset,
          };
        }),
      };
    });
  }
}
