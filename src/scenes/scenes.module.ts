import { Module } from "@nestjs/common";

import { MainScene } from "./main.scene";
import { WelcomeScene } from "./welcome.scene";

@Module({
  providers: [MainScene, WelcomeScene]
})
export class ScenesModule {
}
