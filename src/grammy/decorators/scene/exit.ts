import { SceneMethodType } from '../types/scene-method-metadata';
import { createSceneMethodDecorator } from '../utils/createSceneMethodDecorator';

export const Exit = (): MethodDecorator =>
  createSceneMethodDecorator(SceneMethodType.Step);
