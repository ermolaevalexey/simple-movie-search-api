import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as Router from '@koa/router';
import { Inject, Injectable } from '../../core/di';
import { StoreProvider, TStoreProvider } from '../db';
import { MoviesController } from '../movies/controller';

export const TAppProvider = Symbol.for('AppProvider');

@Injectable()
export class AppProvider {

    constructor(
        @Inject('Koa') private server: Koa,
        @Inject('Router') private router: Router,
        @Inject('MoviesController') private moviesController: MoviesController
    ) {
        this.router.get('/app', async (ctx, next) => {
            ctx.body = JSON.stringify({
                app: 'App is Running!'
            });
        })
    }

    run() {
        this.server
            .use(bodyParser())
            .use(this.router.routes())
            .listen(3000);
    }
}
