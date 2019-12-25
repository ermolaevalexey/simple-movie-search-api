import * as Router from '@koa/router';
import * as Koa from 'koa';
import './src/core/config/env';
import { Container } from './src/core/di';
import { LifeTime } from './src/core/di/container';
import EnvProvider from './src/core/providers/env';
import { AppProvider, TAppProvider } from './src/providers/app';
import { StoreProvider, TStoreProvider } from './src/core/providers/db';
import { MiddlewareProvider } from './src/providers/middleware';
import { MoviesController } from './src/providers/movies/controller';
import { MoviesRepository } from './src/providers/movies/repository';


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
            token: 'EnvProvider',
            _value: new EnvProvider(),
            lifeTime: LifeTime.Persistent
        },
        {
            token: 'MiddlewareProvider',
            _class: MiddlewareProvider,
            lifeTime: LifeTime.PerRequest
        },
        {
            token: TStoreProvider,
            _class: StoreProvider,
            lifeTime: LifeTime.Persistent
        },
        {
            token: TAppProvider,
            _class: AppProvider,
            lifeTime: LifeTime.Persistent
        },
        {
            token: 'MoviesRepository',
            _class: MoviesRepository,
            lifeTime: LifeTime.PerRequest
        },
        {
            token: 'MoviesController',
            _class: MoviesController,
            lifeTime: LifeTime.PerRequest
        }
    ]);

    const app: AppProvider = container.resolve(TAppProvider);
    app.run();
}

bootstrap();
