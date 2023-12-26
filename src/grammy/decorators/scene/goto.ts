import { SceneMethodType } from '../types/scene-method-metadata';
import { createSceneMethodDecorator } from '../utils/createSceneMethodDecorator';

export const Goto = (name: string): MethodDecorator =>
  createSceneMethodDecorator(SceneMethodType.Goto, { name });
