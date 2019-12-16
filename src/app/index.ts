import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as Router from '@koa/router';
import { Sequelize } from 'sequelize';
import { Container, Injector, Service } from '../core/di';
import db from '../db';

@Service()
class Service1 {
    constructor(
        private router: Router,
    ) {}
    someMethod() {
        console.log('method');
        this.router.get('/service1', async (ctx: any, next: Function) => {
            ctx.body = JSON.stringify({ success: true });
            await next();
        });
    }


}

@Container(Injector, {
    Service1
})
export class App {

    private server = new Koa();
    private router = new Router();

    private store = db;
    constructor(
        private _services?: any,
        private injector?: Injector
    ) {}

    logSrv() {
        this._services.Service1.someMethod();
        // console.log('main router routes', this.router.stack);
        this.router.use(this._services.Service1.router.routes());
        // console.log('service1 router routes', this._services.Service1.router.stack)
        // console.log('main router routes', this.router.stack);
    }

    run() {
        this.server
            .use(bodyParser())
            .use(this.router.routes())
            .listen(3000);
    }
}
