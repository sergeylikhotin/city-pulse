import { SceneMethodType } from '../types/scene-method-metadata';
import { createSceneMethodDecorator } from '../utils/createSceneMethodDecorator';

export const Call = (name: string): MethodDecorator =>
  createSceneMethodDecorator(SceneMethodType.Call, { name });
