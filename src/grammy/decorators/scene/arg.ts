import { createSceneMethodDecorator } from '../../utils/create-scene-method-decorator';
import { SceneMethodType } from '../../types/scene-method-type';

export const Arg = (arg: any): MethodDecorator =>
  createSceneMethodDecorator(SceneMethodType.Arg, { arg });
