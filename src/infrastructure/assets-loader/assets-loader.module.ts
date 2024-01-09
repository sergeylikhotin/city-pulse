import { Global, Module } from "@nestjs/common";
import { AssetsLoaderService } from "./assets-loader.service";

@Global()
@Module({
  providers: [AssetsLoaderService],
  exports: [AssetsLoaderService]
})
export class AssetsLoaderModule {
}
