import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as Router from '@koa/router';
import { Container, Injector, Service } from '../core/di';

@Service()
class Service1 {
    constructor(
        private router: Router
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

    constructor(
        private _services?: any,
        private store?: any,
        private injector?: Injector
    ) {}

    logSrv() {
        this._services.Service1.someMethod();
        console.log('main router routes', this.router.routes());
        this.router.use(this._services.Service1.router.routes());
        console.log('service1 router routes', this._services.Service1.router.routes())
    }

    run() {
        this.server
            .use(bodyParser())
            .use(this.router.routes())
            .listen(3000);
    }
}
