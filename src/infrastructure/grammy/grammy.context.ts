import {
  Api as GrammyApi,
  Context as GrammyContext,
  SessionFlavor,
} from 'grammy';
import {
  SceneFlavoredContext,
  ScenesFlavor,
  ScenesSessionData,
} from 'grammy-scenes';
import { HydrateApiFlavor, HydrateFlavor } from '@grammyjs/hydrate';
import { ReplyLoadingFlavor } from './plugings/reply-loading.plugin';
import { PlayerFlavor } from '../../domain/entity/player.plugin';
import { MenuFlavor } from './plugings/reply-menu.plugin';

export type Context = HydrateFlavor<GrammyContext> &
  SessionFlavor<ScenesSessionData> &
  ScenesFlavor &
  ReplyLoadingFlavor &
  PlayerFlavor &
  MenuFlavor;
export type SceneContext<S = unknown> = SceneFlavoredContext<Context, S>;

export type Api = HydrateApiFlavor<GrammyApi>;
