import { SceneMethodType } from '../types/scene-method-metadata';
import { createSceneMethodDecorator } from '../utils/createSceneMethodDecorator';

export const Step = (): MethodDecorator =>
  createSceneMethodDecorator(SceneMethodType.Step);
