import { Injectable } from '@nestjs/common';
import { BusinessService } from '../../data-modules/business/business.service';
import { BusinessBankingService } from '../../data-modules/banking/business/banking.service';
import { AssetsLoaderService } from '../../assets-loader/assets-loader.service';
import { ProductService } from '../../data-modules/product/product.service';
import { PlayerBusiness } from './types/player-business';

@Injectable()
export class BusinessManagementService {
  constructor(
    private readonly businessService: BusinessService,
    private readonly productService: ProductService,
    private readonly businessBankingService: BusinessBankingService,
    private readonly assetsLoaderService: AssetsLoaderService,
  ) {}

  async debugCreateBusiness(playerId: string, type: string) {
    const asset = this.assetsLoaderService.getBusinessAsset(type);
    if (asset == null) {
      throw new Error(`No ${type} business asset found.`);
    }

    const business = await this.businessService.createBusiness(playerId, type);

    await this.productService.createBusinessProducts(
      business.id,
      asset.products,
    );
    await this.businessBankingService.createBankAccount(business.id);

    return business;
  }

  async getPlayerBusinesses(playerId: string): Promise<PlayerBusiness[]> {
    const businesses =
      await this.businessService.getBusinessesByPlayer(playerId);

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
