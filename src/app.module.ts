import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { DomainModule } from "./domain/domain.module";
import { InfrastructureModule } from "./infrastructure/infrastructure.module";
import { ScenesModule } from "./scenes/scenes.module";

@Module({
  imports: [DomainModule, InfrastructureModule, ScenesModule],
  providers: [AppService]
})
export class AppModule {
}
