import { createSceneComposerMethodDecorator } from '../../utils/create-scene-composer-method-decorator';
import { SceneComposerMethodType } from '../../types/scene-composer-method-type';
import { MaybeArray, StringWithSuggestions } from 'grammy/out/context';

export const Command = <S extends string>(
  command: MaybeArray<StringWithSuggestions<S | 'start' | 'help' | 'settings'>>,
): MethodDecorator =>
  createSceneComposerMethodDecorator(SceneComposerMethodType.Command, {
    command,
  });
