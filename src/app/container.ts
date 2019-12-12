import * as Koa from 'koa';
import * as koaBodyParser from 'koa-bodyparser';
import { Sequelize } from 'sequelize';
import { Controller, Repository } from '../providers/types';


export class AppContainer {
    private server: Koa = new Koa();
    private services: Record<string, Controller | Repository<any>> = {};

    constructor(
        private _store: Sequelize
    ) {}

    registerService<T extends Controller | Repository<any>>(name: string, callback: (c: AppContainer) => T): AppContainer {
        Object.defineProperty(this, name, {
            get: () => {
                if (!this.services.hasOwnProperty(name)) {
                    this.services[name] = callback(this);
                }
                return this.services[name];
            },
            configurable: true,
            enumerable: true
        });

        return this;
    }

    runServer(port: number): void {
        this
            .applyMiddleware(this.server)
            .listen(port);
    }

    private applyMiddleware(server: Koa): Koa {
        console.log(this.services);
        server
            .use(koaBodyParser())
            // @ts-ignore
            .use((this['MoviesController'] as Controller).router.routes() as any);

        return server;
    }

    get store(): Sequelize {
        return this._store;
    }
}
