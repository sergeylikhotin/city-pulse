import { Global, Module } from '@nestjs/common';
import { GrammyService } from './grammy.service';
import { DiscoveryModule } from '@nestjs/core';

import { ReplyLoadingPlugin } from './plugings/reply-loading.plugin';
import { ReplyMenuPlugin } from './plugings/reply-menu.plugin';

import { ConfigurableModuleClass } from './grammy.module.definition';

@Global()
@Module({
  imports: [DiscoveryModule],
  providers: [GrammyService, ReplyLoadingPlugin, ReplyMenuPlugin],
  exports: [GrammyService],
})
export class GrammyModule extends ConfigurableModuleClass {}
