import { Global, Module } from "@nestjs/common";
import { GrammyService } from "./grammy.service";
import { ConfigurableModuleClass } from "./grammy.module.definition";
import { DiscoveryModule } from "@nestjs/core";
import { GrammyTestScene } from "./grammy.test.scene";
import { ReplyLoadingPlugin } from "./plugings/reply-loading.plugin";

@Global()
@Module({
  imports: [DiscoveryModule],
  providers: [GrammyService, ReplyLoadingPlugin, GrammyTestScene],
  exports: [GrammyService]
})
export class GrammyModule extends ConfigurableModuleClass {
}
