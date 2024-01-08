import { Injectable } from '@nestjs/common';

import { BusinessProductAsset } from '../../assets-loader/types/business.asset';
import { PrismaService } from '../../prisma/prisma.service';
import { ProductProductionType } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  createBusinessProducts(
    businessId: string,
    products: {
      consumable: BusinessProductAsset[];
      producible: BusinessProductAsset[];
    },
  ) {
    const createProductInputFromAsset = (
      asset: BusinessProductAsset,
      productionType: ProductProductionType,
    ) => ({
      businessId,

      type: asset.type,

      quantity: asset.initialQuantity ?? 0,

      quantityPerTimeUnit: asset.quantityPerTimeUnit,
      timeUnitType: asset.timeUnitType,

      productionType,
    });

    const consumable = products.consumable.map((asset) =>
      createProductInputFromAsset(asset, ProductProductionType.CONSUMABLE),
    );
    const producible = products.producible.map((asset) =>
      createProductInputFromAsset(asset, ProductProductionType.PRODUCIBLE),
    );

    return this.prisma.product.createMany({
      data: [...consumable, ...producible],
    });
  }
}
