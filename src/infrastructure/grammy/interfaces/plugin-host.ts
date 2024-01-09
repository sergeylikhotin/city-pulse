import { MiddlewareObj } from 'grammy';
import { Context } from '../grammy.context';

export interface PluginHost<C extends Context> extends MiddlewareObj<C> {}
