import 'reflect-metadata';
import * as Router from '@koa/router';
import { Injector } from './injector';


export function Container(injector: typeof Injector, services: object) {
    return function <T extends { new(...args: any[]): {} }>(constructor: T) {
        return class extends constructor {
            // @ts-ignore
           private _services = Object.keys(services).reduce((acc: object, key: string) => {
               // @ts-ignore
               acc[key] = this.injector.resolve(services[key]);
               return acc;
           }, {});
           // @ts-ignore
           private router: Router;
           private store: any;
            // @ts-ignore
           private injector: Injector;
           constructor(...rest: any[]) {
               super(...rest);
           }
        }
    }
}
