import { SceneMethodType } from '../types/scene-method-metadata';
import { createSceneMethodDecorator } from '../utils/createSceneMethodDecorator';

export const Wait = (): MethodDecorator =>
  createSceneMethodDecorator(SceneMethodType.Wait);
