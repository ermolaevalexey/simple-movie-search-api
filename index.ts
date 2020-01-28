import * as Router from '@koa/router';
import * as Koa from 'koa';
import './src/core/config/env';
import { Container } from './src/core/di';
import { LifeTime } from './src/core/di/container';
import { StoreProvider, TStoreProvider } from './src/core/providers/db';
import EnvProvider, { TEnvProvider } from './src/core/providers/env';
import { StaticStorageProvider, TStaticStorageProvider } from './src/core/providers/static-storage';
import { AppProvider, TAppProvider } from './src/providers/app';
import { DirectorsController, TDirectorsController } from './src/providers/directors/controller';
import { DirectorsRepository, TDirectorsRepository } from './src/providers/directors/repository';
import { MiddlewareProvider, TMiddlewareProvider } from './src/providers/middleware';
import { MoviesController, TMoviesController } from './src/providers/movies/controller';
import { MoviesRepository, TMoviesRepository } from './src/providers/movies/repository';
import { StaticController, TStaticController } from './src/providers/static/controller';


function bootstrap() {
    const container = new Container();

    container.register([
        {
            token: 'Koa',
            _value: new Koa(),
            lifeTime: LifeTime.Persistent
        },
        {
            token: 'Router',
            _value: new Router(),
            lifeTime: LifeTime.Persistent
        },
        {
            token: TEnvProvider,
            _value: new EnvProvider(),
            lifeTime: LifeTime.Persistent
        },

        {
            token: TStoreProvider,
            _class: StoreProvider,
            lifeTime: LifeTime.Persistent
        },
        {
            token: TStaticStorageProvider,
            _class: StaticStorageProvider,
            lifeTime: LifeTime.Persistent
        },
        {
            token: TAppProvider,
            _class: AppProvider,
            lifeTime: LifeTime.Persistent
        },
        {
            token: TMiddlewareProvider,
            _class: MiddlewareProvider,
            lifeTime: LifeTime.PerRequest
        },
        {
            token: TMoviesRepository,
            _class: MoviesRepository,
            lifeTime: LifeTime.PerRequest
        },
        {
            token: TMoviesController,
            _class: MoviesController,
            lifeTime: LifeTime.PerRequest
        },
        {
            token: TDirectorsRepository,
            _class: DirectorsRepository,
            lifeTime: LifeTime.PerRequest
        },
        {
            token: TDirectorsController,
            _class: DirectorsController,
            lifeTime: LifeTime.PerRequest
        },
        {
            token: TStaticController,
            _class: StaticController,
            lifeTime: LifeTime.PerRequest
        }
    ]);

    const app: AppProvider = container.resolve(TAppProvider);
    app.run();
}

bootstrap();
