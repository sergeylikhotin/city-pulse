import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Bot, Composer, session } from 'grammy';
import { MODULE_OPTIONS_TOKEN } from './grammy.module.definition';
import { Api, Context } from './grammy.context';
import { hydrate, hydrateApi } from '@grammyjs/hydrate';
import { run, RunOptions } from '@grammyjs/runner';
import { Update } from 'grammy/types';
import { cqrs } from './plugings/cqrs';
import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import { player } from './plugings/player';
import { replyLoading } from './plugings/reply-loading';
import { Scene, ScenesComposer } from 'grammy-scenes';
import { MetadataScanner, ModulesContainer, Reflector } from '@nestjs/core';
import { SceneMethodsMetadata } from './types/scene-methods-metadata';
import { SceneComposerMethodMetadata } from './types/scene-composer-method-metadata';
import {
  SCENE_COMPOSER_METHOD_METADATA,
  SCENE_METADATA,
  SCENE_METHODS_METADATA,
} from './grammy.constants';
import { SceneMethodType } from './types/scene-method-type';
import { SceneComposerMethodType } from './types/scene-composer-method-type';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { Injector } from '@nestjs/core/injector/injector';
import { SceneMetadata } from './types/scene-metadata';
import { SceneCallback } from './types/common/callback';

@Injectable()
export class GrammyService extends Bot<Context, Api> implements OnModuleInit {
  private readonly scenesComposer: ScenesComposer<Context> =
    new ScenesComposer<Context>();

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) token: string,

    private commandBus: CommandBus,
    private eventBus: EventBus,
    private queryBus: QueryBus,

    private modulesContainer: ModulesContainer,
    private metadataScanner: MetadataScanner,
    private reflector: Reflector,
  ) {
    super(token);

    this.initializeMiddleware();
  }

  private initializeMiddleware() {
    this.use(this.session());

    this.use(hydrate());
    this.api.config.use(hydrateApi());

    this.use(replyLoading());
    this.use(cqrs(this.commandBus, this.eventBus, this.queryBus));
    // this.use(player());
  }

  private session() {
    return session<any, Context>({ initial: () => ({}) });
  }

  onModuleInit(): any {
    this.createScenesFromProviders();

    this.use(this.scenesComposer.manager());
  }

  private createScenesFromProviders() {
    this.getScenesInstanceWrappers().forEach((wrapper) =>
      this.configureScene(wrapper),
    );
  }

  private configureScene(wrapper: InstanceWrapper) {
    const { instance, metatype } = wrapper;
    const { name } = this.reflector.get<SceneMetadata>(
      SCENE_METADATA,
      metatype,
    );

    const scene = new Scene<Context>(name ?? metatype.name);
    this.setupSceneMethods(instance, scene);

    this.scenesComposer.scene(scene);
  }

  private setupSceneMethods(instance: any, scene: Scene<Context>) {
    this.metadataScanner
      .getAllMethodNames(Object.getPrototypeOf(instance))
      .forEach((methodName) => {
        this.configureSceneMethod(instance, scene, methodName);
      });
  }

  private configureSceneMethod(
    instance: any,
    scene: Scene<Context>,
    methodName: string,
  ) {
    const callback = instance[methodName];
    const sceneComposer = this.applySceneMethods(scene, callback);

    this.applySceneComposerMethods(sceneComposer, callback);
  }

  private applySceneMethods(scene: Scene<Context>, callback: SceneCallback) {
    const sceneMethodsMetadata = this.reflector.get<SceneMethodsMetadata>(
      SCENE_METHODS_METADATA,
      callback,
    );
    if (!sceneMethodsMetadata) return;

    let sceneComposer: Composer<Context>;
    sceneMethodsMetadata.forEach(({ type, args }) => {
      sceneComposer = this.applySceneMethod(scene, type, args, callback);
    });
    return sceneComposer;
  }

  private applySceneMethod(
    scene: Scene<Context>,
    type: SceneMethodType,
    args: Record<string, any>,
    callback: SceneCallback,
  ) {
    switch (type) {
      case SceneMethodType.Always:
        return scene.always();
      case SceneMethodType.Step:
        scene.step(callback);
        break;
      case SceneMethodType.Label:
        scene.label(args.label);
        break;
      case SceneMethodType.Wait:
        return scene.wait(args.label);
      case SceneMethodType.Call:
        scene.call(args.name);
        break;
      case SceneMethodType.Exit:
        scene.exit();
        break;
      case SceneMethodType.Goto:
        scene.goto(args.name);
        break;
      default:
        return null;
    }
  }

  private applySceneComposerMethods(
    sceneComposer: Composer<Context>,
    callback: SceneCallback,
  ) {
    const sceneComposerMetadata =
      this.reflector.get<SceneComposerMethodMetadata>(
        SCENE_COMPOSER_METHOD_METADATA,
        callback,
      );
    if (!sceneComposerMetadata) return;
    if (!sceneComposer)
      throw new Error(
        'You should use scene decorators that return a scene composer to utilize scene composer decorators.',
      );

    this.applySceneComposerMethod(
      sceneComposer,
      sceneComposerMetadata,
      callback,
    );
  }

  private applySceneComposerMethod(
    sceneComposer: Composer<Context>,
    metadata: SceneComposerMethodMetadata,
    callback: SceneCallback,
  ) {
    const { type, args } = metadata;
    switch (type) {
      case SceneComposerMethodType.On:
        sceneComposer.on(args.filter, callback);
        break;
      case SceneComposerMethodType.Command:
        sceneComposer.command(args.command, callback);
        break;
      case SceneComposerMethodType.CallbackQuery:
        sceneComposer.callbackQuery(args.trigger, callback);
        break;
      case SceneComposerMethodType.Use:
        sceneComposer.use(callback);
        break;
      case SceneComposerMethodType.Hears:
        sceneComposer.hears(args.trigger, callback);
        break;
      case SceneComposerMethodType.ChatType:
        sceneComposer.chatType(args.chatType, callback);
        break;
    }
  }

  private getScenesInstanceWrappers() {
    return [...this.modulesContainer.values()]
      .flatMap((module) => [...module.providers.values()])
      .filter((provider) => this.isSceneProvider(provider));
  }

  private isSceneProvider(provider) {
    const { instance, isNotMetatype, metatype } = provider;
    if (!instance || isNotMetatype) return false;

    return !!this.reflector.get(SCENE_METADATA, metatype);
  }

  run(options?: RunOptions<Update>) {
    this.use(this.scenesComposer);

    return run(this, options);
  }
}
