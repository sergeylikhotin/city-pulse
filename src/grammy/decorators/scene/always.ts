import { SceneMethodType } from '../types/scene-method-metadata';
import { createSceneMethodDecorator } from '../utils/createSceneMethodDecorator';

export const Always = (): MethodDecorator =>
  createSceneMethodDecorator(SceneMethodType.Always);
