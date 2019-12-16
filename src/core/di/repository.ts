import 'reflect-metadata';
import { GenericClassDecorator } from '../../types/core';

export const REPOSITORY_INJECTION_KEY = 'REPOSITORY_INJECTION_KEY';
const REPOSITORY_INJECTION_TOKEN = Symbol.for(REPOSITORY_INJECTION_KEY);

export const Repository = <T>(): GenericClassDecorator<T> => {
    return (target: T) => {
        if (!Reflect.getMetadata(REPOSITORY_INJECTION_KEY, target)) {
            Reflect.defineMetadata(REPOSITORY_INJECTION_KEY, REPOSITORY_INJECTION_TOKEN, target);
        }
    };
};
