import { Context } from '../grammy.context';

export type SceneFunction = (ctx: Context) => unknown | Promise<unknown>;
