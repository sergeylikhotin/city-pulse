import { Product } from '@prisma/client';
import { ProductAsset } from '../../../../infrastructure/assets-loader/types/product.asset';

export type PlayerProduct = Product & { asset: ProductAsset };
