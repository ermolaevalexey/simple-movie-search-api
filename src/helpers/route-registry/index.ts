import * as Koa from 'koa';
import * as KoaRouter from '@koa/router';
import { RouteModel } from "../../models/router";


export class RouteRegistry {
    private router: KoaRouter = new KoaRouter();

    registerRoute(model: RouteModel): void {
        this.router.register(model.path, model.methods, model.handler);
    }

    get routes(): Koa.ParameterizedContext<any, any> {
        return this.router.routes();
    }
}

export default new RouteRegistry();
