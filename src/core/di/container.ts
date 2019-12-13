import 'reflect-metadata';
import * as Router from '@koa/router';
import { GenericClassDecorator } from '../../types/core';
import { Injector } from './injector';


interface Type<T> {
    new(...args: any[]): T;
}
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
               // console.log(this['router'] as any);
               // console.log(this['store'] as any);
           }
        }
    }
}
// export const Container = <T>(params: object): GenericClassDecorator<T> => {
//     return (target: T) => {
//         console.log(Reflect.getMetadata('design:paramtypes', target));
//
//         if (!Reflect.hasMetadata('services', (target as any).constructor)) {
//             Reflect.defineMetadata('services', {}, (target as any).constructor);
//         }
//
//         const prevServices = Reflect.getMetadata('services', (target as any).constructor);
//         const currentServices = {
//             ...prevServices,
//             ...params
//         };
//
//         console.log(currentServices);
//
//         //Reflect.defineMetadata('services', currentServices, (target as any).constructor);
//         Reflect.defineMetadata('design:paramtypes', currentServices, target, 'services');
//         // return new (target as any)(currentServices);
//     };
// };
