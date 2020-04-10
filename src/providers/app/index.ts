import * as Koa from 'koa';
import * as Router from '@koa/router';
import * as koaBody from 'koa-body';
import * as koaCors from '@koa/cors';

import { isClass } from '../../core/utils/di';
import { CONTROLLER_KEY, ROUTE_KEY, RouteMethodParams } from '../../core/routing/decorators';
import { Container, Inject, Injectable } from '../../core/di';
import EnvProvider, { TEnvProvider } from '../../core/providers/env';
import { MiddlewareProvider, TMiddlewareProvider } from '../middleware';
import { RegistryItem, TContainer } from '../../core/di/container';


export const TAppProvider = Symbol.for('AppProvider');

@Injectable()
export class AppProvider {

  constructor(
    @Inject('Koa') private server: Koa,
    @Inject('Router') private router: Router,
    @Inject(TEnvProvider) private envProvider: EnvProvider,
    @Inject(TContainer) private container: Container,
    @Inject(TMiddlewareProvider) private middlewareProvider: MiddlewareProvider
  ) {
    this.registerControllers();
  }

  run() {
    this.server
      .use(koaCors())
      .use(koaBody({
        json: true,
        multipart: true
      }))
      .use(this.router.routes())
      .use(this.router.allowedMethods())
      .listen(this.envProvider.appPort);
  }

  private registerControllers(): void {
    const registryControllers = Array
      .from(this.container.registry.entries())
      .map(([ _, _value ]) => _value)
      .filter(item => isClass(item.value) && Reflect.hasMetadata(CONTROLLER_KEY, item.value));

    registryControllers.forEach((item: RegistryItem) => {
      const controller = this.container.resolve(item.token);
      const baseControllerPath: string = Reflect.getMetadata(CONTROLLER_KEY, (controller as any).constructor);
      const routes: RouteMethodParams[] = Reflect.getOwnMetadata(ROUTE_KEY, (controller as any).constructor);

      routes.forEach(route => {
        const mws = [
          this.middlewareProvider.handleError(),
          route.needAuth ? this.middlewareProvider.verifyToken() : undefined,
          (controller as any)[route.handler],
          this.middlewareProvider.setContentType(route.contentType),
          this.middlewareProvider.setStatus(route.method),
          this.middlewareProvider.sendData()
        ];

        this.router[route.method]( baseControllerPath + route.path, ...mws.filter(Boolean));
      });
    });
  }
}
