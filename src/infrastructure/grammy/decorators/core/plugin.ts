import { SetMetadata } from '@nestjs/common';
import { PLUGIN_METADATA } from '../../grammy.constants';

export const Plugin = (): ClassDecorator =>
  SetMetadata<string, any>(PLUGIN_METADATA, {});
