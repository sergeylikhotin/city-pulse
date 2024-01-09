import { Inject, Injectable, Logger, OnModuleInit, Type } from "@nestjs/common";
import { Bot, Composer, MiddlewareFn, session } from "grammy";
import { GrammyModuleConfiguration, MODULE_OPTIONS_TOKEN } from "./grammy.module.definition";
import { Api, Context } from "./grammy.context";
import { hydrate, hydrateApi } from "@grammyjs/hydrate";
import { run, RunOptions } from "@grammyjs/runner";
import { Update } from "grammy/types";
import { Scene, ScenesComposer } from "grammy-scenes";
import { MetadataScanner, ModulesContainer, Reflector } from "@nestjs/core";
import { SceneMethodsMetadata } from "./types/scene-methods-metadata";
import { SceneComposerMethodMetadata } from "./types/scene-composer-method-metadata";
import {
  PLUGIN_METADATA,
  SCENE_COMPOSER_METHOD_METADATA,
  SCENE_METADATA,
  SCENE_METHODS_METADATA
} from "./grammy.constants";
import { SceneMethodType } from "./types/scene-method-type";
import { SceneComposerMethodType } from "./types/scene-composer-method-type";
import { InstanceWrapper } from "@nestjs/core/injector/instance-wrapper";
import { SceneMetadata } from "./types/scene-metadata";
import { SceneFunction } from "./types/scene-function";
import { GrammyUserError } from "./grammy.user-error";

@Injectable()
export class GrammyService extends Bot<Context, Api> implements OnModuleInit {
  private readonly logger: Logger = new Logger(GrammyService.name);
  private readonly scenesComposer: ScenesComposer<Context> =
    new ScenesComposer<Context>();

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly configuration: GrammyModuleConfiguration,
    private readonly modulesContainer: ModulesContainer,
    private readonly metadataScanner: MetadataScanner,
    private readonly reflector: Reflector
  ) {
    super(configuration.botToken);

    this.initializeMiddleware();

    this.catch(async (botError) => {
      if (botError.error instanceof GrammyUserError) {
        return await botError.ctx.reply(botError.error.message);
      }

      this.logger.error(botError.error, botError.stack);

      await botError.ctx.reply(
        `Произошла ошибка... Мы уже получили сообщение об ошибке и работаем над этим.`
      );
    });
  }

  private get debug() {
    return !!this.configuration?.scenes?.debug;
  }

  private initializeMiddleware() {
    this.use(this.session());

    this.use(hydrate());
    this.api.config.use(hydrateApi());
  }

  private session() {
    return session<any, Context>({ initial: () => ({}) });
  }

  onModuleInit(): any {
    this.usePluginsFromProviders();

    this.composeScenesFromProviders();
  }

  private usePluginsFromProviders() {
    this.getProvidersByFilter((provider) =>
      this.isPluginProvider(provider)
    ).forEach((provider) => this.applyPlugin(provider));
  }

  private applyPlugin(provider: InstanceWrapper) {
    this.use(provider.instance);
  }

  private composeScenesFromProviders() {
    this.getProvidersByFilter((provider) =>
      this.isSceneProvider(provider)
    ).forEach((provider) => this.configureScene(provider));

    this.use(this.scenesComposer.manager());
  }

  private configureScene(provider: InstanceWrapper) {
    const { instance, metatype } = provider;
    const sceneMetadata = this.reflector.get<SceneMetadata>(
      SCENE_METADATA,
      metatype
    );

    const scene = this.createSceneFromMetatype(sceneMetadata, metatype);

    if (this.debug) {
      scene
        .label("SCENE_ENTER")
        .step(
          async (ctx) =>
            await ctx.reply(
              `-----------------Enter ${scene.id}-----------------`
            )
        );
    }

    this.setupSceneMethods(instance, scene);

    if (this.debug) {
      scene
        .label("SCENE_EXIT")
        .step(
          async (ctx) =>
            await ctx.reply(
              `-----------------Exit ${scene.id}-----------------`
            )
        );
    }

    this.scenesComposer.scene(scene);
  }

  private createSceneFromMetatype(
    sceneMetadata: SceneMetadata,
    metatype: Type | Function
  ) {
    const sceneName = sceneMetadata.name ?? metatype.name;

    return new Scene<Context>(sceneName);
  }

  private setupSceneMethods(instance: any, scene: Scene<Context>) {
    this.metadataScanner
      .getAllMethodNames(Object.getPrototypeOf(instance))
      .forEach((methodName) => {
        this.configureSceneMethods(scene, instance, methodName);
      });
  }

  private configureSceneMethods(
    scene: Scene<Context>,
    instance: any,
    methodName: string
  ) {
    const func = instance[methodName];
    const middleware = func.bind(instance);

    try {
      const sceneComposer = this.applySceneMethods(scene, func, middleware);

      this.applySceneComposerMethods(sceneComposer, func, middleware);
    } catch (err) {
      this.logger.error(`[${instance.constructor.name}] ${err.message}`);
      throw err;
    }
  }

  private applySceneMethods(
    scene: Scene<Context>,
    func: SceneFunction,
    middleware: MiddlewareFn
  ) {
    const sceneMethodsMetadata = this.reflector.get<SceneMethodsMetadata>(
      SCENE_METHODS_METADATA,
      func
    );
    if (!sceneMethodsMetadata) return;

    const sceneComposers = sceneMethodsMetadata
      .reverse() // Reverse scenes methods because of decorators execution order is reversed
      .map(({ type, args }) =>
        this.applySceneMethod(scene, type, args, middleware)
      )
      .filter((composer) => composer);
    if (sceneComposers.length > 1) {
      throw new Error(
        `${func.name} must have only one decorator that return scene composer.`
      );
    }

    return sceneComposers[0];
  }

  private applySceneMethod(
    scene: Scene<Context>,
    type: SceneMethodType,
    args: Record<string, any>,
    middleware: MiddlewareFn
  ) {
    switch (type) {
      case SceneMethodType.Always:
        return scene.always();
      case SceneMethodType.Step:
        scene.step(middleware);
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
    func: SceneFunction,
    middleware: MiddlewareFn
  ) {
    const sceneComposerMetadata =
      this.reflector.get<SceneComposerMethodMetadata>(
        SCENE_COMPOSER_METHOD_METADATA,
        func
      );
    if (!sceneComposerMetadata) return;
    if (!sceneComposer)
      throw new Error(
        "You should use scene decorators that return a scene composer to utilize scene composer decorators."
      );

    this.applySceneComposerMethod(
      sceneComposer,
      sceneComposerMetadata,
      middleware
    );
  }

  private applySceneComposerMethod(
    sceneComposer: Composer<Context>,
    metadata: SceneComposerMethodMetadata,
    middleware: MiddlewareFn
  ) {
    const { type, args } = metadata;
    switch (type) {
      case SceneComposerMethodType.On:
        sceneComposer.on(args.filter, middleware);
        break;
      case SceneComposerMethodType.Command:
        sceneComposer.command(args.command, middleware);
        break;
      case SceneComposerMethodType.CallbackQuery:
        sceneComposer.callbackQuery(args.trigger, middleware);
        break;
      case SceneComposerMethodType.Use:
        sceneComposer.use(middleware);
        break;
      case SceneComposerMethodType.Hears:
        sceneComposer.hears(args.trigger, middleware);
        break;
      case SceneComposerMethodType.ChatType:
        sceneComposer.chatType(args.chatType, middleware);
        break;
    }
  }

  private getProvidersByFilter(
    filter: (
      provider: InstanceWrapper,
      index: number,
      array: InstanceWrapper[]
    ) => boolean
  ) {
    return [...this.modulesContainer.values()]
      .flatMap((module) => [...module.providers.values()])
      .filter(filter);
  }

  private isSceneProvider(provider: InstanceWrapper) {
    const { instance, isNotMetatype, metatype } = provider;
    if (instance == null || isNotMetatype) return false;

    return !!this.reflector.get(SCENE_METADATA, metatype);
  }

  private isPluginProvider(provider: InstanceWrapper) {
    const { instance, isNotMetatype, metatype } = provider;
    if (instance == null || isNotMetatype) return false;

    return !!this.reflector.get(PLUGIN_METADATA, metatype);
  }

  run(options?: RunOptions<Update>) {
    this.use(this.scenesComposer);

    return run(this, options);
  }
}
