import { Context } from '../../grammy.context';

export type SceneCallback = (ctx: Context) => unknown | Promise<unknown>;
