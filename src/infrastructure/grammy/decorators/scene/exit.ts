import { createSceneMethodDecorator } from '../../utils/create-scene-method-decorator';
import { SceneMethodType } from '../../types/scene-method-type';

export const Exit = (arg?: any): MethodDecorator =>
  createSceneMethodDecorator(SceneMethodType.Exit, { arg });
