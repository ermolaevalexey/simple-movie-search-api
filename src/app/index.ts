import * as Koa from 'koa';
import * as koaBodyParser from 'koa-bodyparser';
import { Sequelize } from 'sequelize';
import { RouteRegistry } from '../helpers/route-registry';
import { Route, Repository } from '../providers/types';


export class AppContainer {
    private server: Koa = new Koa();
    private services: Record<string, Route | Repository<any>> = {};

    constructor(
        private routeRegistry: RouteRegistry,
        private _store: Sequelize
    ) {}

    registerService<T extends Route | Repository<any>>(name: string, callback: (c: AppContainer) => T): AppContainer {
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
        return server.use(koaBodyParser);
    }

    get store(): Sequelize {
        return this._store;
    }
}
