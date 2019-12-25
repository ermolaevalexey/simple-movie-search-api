import * as Router from '@koa/router';
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import { Container, Inject, Injectable } from '../../core/di';
import { RegistryItem } from '../../core/di/container';
import { ContentTypeKey, CONTROLLER_KEY, ROUTE_KEY, RouteMethodParams } from '../../core/routing/decorators';
import { isClass } from '../../core/utils/di';
import { MiddlewareProvider } from '../middleware';


export const TAppProvider = Symbol.for('AppProvider');

@Injectable()
export class AppProvider {

    constructor(
        @Inject('Koa') private server: Koa,
        @Inject('Router') private router: Router,
        @Inject('Container') private container: Container,
        @Inject('MiddlewareProvider') private middlewareProvider: MiddlewareProvider
    ) {
        this.registerControllers();
    }

    private registerControllers(): void {
        const registryControllers = Array
            .from(this.container.registry.entries())
            .map(([ _, _value ]) => _value)
            .filter((item) => {
                return isClass(item.value) && Reflect.hasMetadata(CONTROLLER_KEY, item.value);
            });

        registryControllers.forEach((item: RegistryItem) => {
            const controller = this.container.resolve(item.token);
            const baseControllerPath: string = Reflect.getMetadata(CONTROLLER_KEY, (controller as any).constructor);
            const routes: Array<RouteMethodParams> = Reflect.getOwnMetadata(ROUTE_KEY, (controller as any).constructor);

            routes.forEach(route => {
                this.router[route.method](
                    baseControllerPath + route.path,
                    this.middlewareProvider.handleError(),
                    (controller as any)[route.handler],
                    this.middlewareProvider.setContentType(route.contentType),
                    this.middlewareProvider.setStatus(route.method),
                    this.middlewareProvider.sendData(),
                );
            });
        });
    }

    run() {
        this.server
            .use(bodyParser())
            .use(this.router.routes())
            .use(this.router.allowedMethods())
            .listen(3000);
    }
}
