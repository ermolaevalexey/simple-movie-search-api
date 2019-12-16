import 'reflect-metadata';
import * as Router from '@koa/router';
import { Injector } from './injector';


export function Container(injector: typeof Injector, services: object) {
    return function <T extends { new(...args: any[]): {} }>(constructor: T) {
        return class extends constructor {
           private _services = Object.keys(services).reduce((acc: object, key: string) => {
               // @ts-ignore
               acc[key] = this.injector.resolve(services[key]);
               return acc;
           }, {});
           private router!: Router;
           private injector!: Injector;
           constructor(...rest: any[]) {

               super(...rest);
           }
        }
    }
}
