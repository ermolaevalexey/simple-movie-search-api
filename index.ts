import * as Router from '@koa/router';
import * as Koa from 'koa';
import './src/config/env';
import { Container } from './src/core/di';
import { LifeTime } from './src/core/di/container';
import { AppProvider, TAppProvider } from './src/providers/app';
import { StoreProvider, TStoreProvider } from './src/providers/db';
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
