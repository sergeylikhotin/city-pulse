import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ProductAsset } from './types/product.asset';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { cwd } from 'process';
import { BusinessAsset } from './types/business.asset';

@Injectable()
export class AssetsLoaderService implements OnModuleInit {
  private readonly logger = new Logger();

  private productAssets: Map<string, ProductAsset>;
  private businessesAssets: Map<string, BusinessAsset>;

  async onModuleInit() {
    const productAssets = await this.loadProductsAssets();
    this.productAssets = new Map(
      productAssets.map((asset) => [asset.type, asset]),
    );

    const businessesAssets = await this.loadBusinessesAssets();
    this.businessesAssets = new Map(
      businessesAssets.map((asset) => [asset.type, asset]),
    );
  }

  getProductAsset(type: string) {
    return this.productAssets.get(type);
  }

  getBusinessAsset(type: string) {
    return this.businessesAssets.get(type);
  }

  async reload() {
    await this.onModuleInit();
  }

  private async loadProductsAssets(): Promise<ProductAsset[]> {
    const assets = await this.loadFile<ProductAsset[]>('products.json');

    this.logger.debug(`${assets.length} products assets loaded.`);

    return assets;
  }

  private async loadBusinessesAssets(): Promise<BusinessAsset[]> {
    const files = await readdir(join(cwd(), 'src/assets/businesses'));
    const assets = await Promise.allSettled(
      files.map((file) => this.loadFile<BusinessAsset>(`/businesses/${file}`)),
    );

    const loadedAssets = assets
      .filter((result) => result.status === 'fulfilled')
      .map((result: PromiseFulfilledResult<BusinessAsset>) => result.value);
    const errorAssets = assets
      .filter((result) => result.status === 'rejected')
      .map((result: PromiseRejectedResult) => result.reason);

    if (loadedAssets.length > 0) {
      this.logger.debug(`${loadedAssets.length} businesses assets loaded.`);
    }
    if (errorAssets.length > 0) {
      this.logger.error(
        `${loadedAssets.length} businesses assets cause error when loading.`,
      );
    }

    return loadedAssets;
  }

  private async loadFile<T>(assetPath: string): Promise<T> {
    const contentBuffer = await readFile(join(cwd(), 'src/assets/', assetPath));
    return JSON.parse(contentBuffer.toString());
  }
}
