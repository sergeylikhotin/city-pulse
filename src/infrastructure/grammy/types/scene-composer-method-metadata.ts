import { SceneComposerMethodType } from './scene-composer-method-type';

export type SceneComposerMethodMetadata = {
  readonly type: SceneComposerMethodType;
  readonly args: Record<string, any>;
};
