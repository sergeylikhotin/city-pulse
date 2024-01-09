import { ConfigurableModuleBuilder } from "@nestjs/common";

export type GrammyModuleConfiguration = {
  botToken: string;

  scenes?: {
    debug?: boolean;
  };
};

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<GrammyModuleConfiguration>().build();
