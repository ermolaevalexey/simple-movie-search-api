import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as Router from '@koa/router';
import { Inject, Injectable } from '../../core/di';
import { StoreProvider, TStoreProvider } from '../db';

export const TAppProvider = Symbol.for('AppProvider');

@Injectable()
export class AppProvider {

    constructor(
        @Inject('Koa') private server: Koa,
        @Inject('Router') private router: Router,
        @Inject(TStoreProvider) private storeProvider: StoreProvider
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

// @Injectable()
// class Service {
//     constructor(
//         @Inject(TStoreProvider) private storeProvider: StoreProvider
//     ) {}
//
//     run() {
//         console.log(this.storeProvider.store.getDialect());
//     }
// }


// export class App {
//     private server = new Koa();
//     private router = new Router();
//
//     private store = db;
//     constructor(
//         private _services?: any,
//     ) {}
//
//     run() {
//         this.server
//             .use(bodyParser())
//             .use(this.router.routes())
//             .listen(3000);
//     }
// }
