import 'reflect-metadata';
import { GenericClassDecorator } from '../../types/core';


export const Service = <T>(): GenericClassDecorator<T> => {
    return (target: T) => {
        console.log(Reflect.getMetadata('design:paramtypes', target));
    };
};
