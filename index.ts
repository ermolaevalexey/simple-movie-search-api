import * as Koa from 'koa';
import * as Router from '@koa/router';
import { Container } from './src/core/di';
import { LifeTime } from './src/core/di/container';
import { AppProvider, TAppProvider } from './src/providers/app';
import { DirectorsController, TDirectorsController } from './src/providers/directors/controller';
import { DirectorsRepository, TDirectorsRepository } from './src/providers/directors/repository';
import EnvProvider, { TEnvProvider } from './src/core/providers/env';
import { MiddlewareProvider, TMiddlewareProvider } from './src/providers/middleware';
import { MoviesController, TMoviesController } from './src/providers/movies/controller';
import { MoviesRepository, TMoviesRepository } from './src/providers/movies/repository';
import { StaticController, TStaticController } from './src/providers/static/controller';
import { StaticStorageProvider, TStaticStorageProvider } from './src/core/providers/static-storage';
import { StoreProvider, TStoreProvider } from './src/core/providers/db';
import { TUsersController, UsersController } from './src/providers/auth/controller';
import { TUsersRepository, UsersRepository } from './src/providers/auth/repository';
import './src/core/config/env';


function bootstrap() {
  const container = new Container();

  container.register([
    {
      _value: new Koa(),
      lifeTime: LifeTime.Persistent,
      token: 'Koa'
    },
    {
      _value: new Router(),
      lifeTime: LifeTime.Persistent,
      token: 'Router'
    },
    {
      _value: new EnvProvider(),
      lifeTime: LifeTime.Persistent,
      token: TEnvProvider
    },

    {
      _class: StoreProvider,
      lifeTime: LifeTime.Persistent,
      token: TStoreProvider
    },
    {
      _class: StaticStorageProvider,
      lifeTime: LifeTime.Persistent,
      token: TStaticStorageProvider
    },
    {
      _class: AppProvider,
      lifeTime: LifeTime.Persistent,
      token: TAppProvider
    },
    {
      _class: MiddlewareProvider,
      lifeTime: LifeTime.PerRequest,
      token: TMiddlewareProvider
    },
    {
      _class: MoviesRepository,
      lifeTime: LifeTime.PerRequest,
      token: TMoviesRepository
    },
    {
      _class: MoviesController,
      lifeTime: LifeTime.PerRequest,
      token: TMoviesController
    },
    {
      _class: DirectorsRepository,
      lifeTime: LifeTime.PerRequest,
      token: TDirectorsRepository
    },
    {
      _class: DirectorsController,
      lifeTime: LifeTime.PerRequest,
      token: TDirectorsController
    },
    {
      _class: StaticController,
      lifeTime: LifeTime.PerRequest,
      token: TStaticController
    },
    {
      _class: UsersRepository,
      lifeTime: LifeTime.PerRequest,
      token: TUsersRepository
    },
    {
      _class: UsersController,
      lifeTime: LifeTime.PerRequest,
      token: TUsersController
    }
  ]);

  const app: AppProvider = container.resolve(TAppProvider);
  app.run();
}

bootstrap();
