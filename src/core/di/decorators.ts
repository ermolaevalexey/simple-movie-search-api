import { GenericClassDecorator } from '../../types/core';
import 'reflect-metadata';

export const INJECTABLE_KEY = 'INJECTABLE_KEY';
export const INJECTIONS_KEY = 'INJECTIONS_KEY';


export function Injectable<T>(): GenericClassDecorator<T> {
  return (target: T) => {
    Reflect.defineMetadata(INJECTABLE_KEY, true, target);
  };
}

export function Inject(token: any) {
  return (target: object, propertyKey: string | symbol, idx: number) => {
    const injections: any[] = Reflect.getMetadata(INJECTIONS_KEY, target) || [];
    injections[idx] = token;
    Reflect.defineMetadata(INJECTIONS_KEY, injections, target);
  };
}
