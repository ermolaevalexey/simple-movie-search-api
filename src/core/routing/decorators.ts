import { GenericClassDecorator } from '../../types/core';
import 'reflect-metadata';

export const CONTROLLER_KEY = 'CONTROLLER_KEY';
export const ROUTE_KEY = 'ROUTE';

export enum MethodKey {
  Get = 'get',
  Post = 'post',
  Put = 'put',
  Delete = 'delete'
}

export enum ContentTypeKey {
  Json = 'application/json',
  Html = 'text/html',
  FormData = 'multipart/formdata',
  Image = 'image'
}

export interface RouteParams {
  path: string;
  method: MethodKey;
  contentType: ContentTypeKey;
  needAuth?: boolean;
}

export interface RouteMethodParams extends RouteParams {
  handler: string;
}

export function Controller<T>(basePath: string): GenericClassDecorator<T> {
  return (target: T) => {
    Reflect.defineMetadata(CONTROLLER_KEY, basePath, target);
  };
}

export function Route(params: RouteParams) {
  return (target: any, key: string) => {
    const metaData: RouteMethodParams = {
      ...params,
      handler: key
    };

    let metadataList: RouteMethodParams[] = [];

    if (!Reflect.hasOwnMetadata(ROUTE_KEY, target.constructor)) {
      Reflect.defineMetadata(ROUTE_KEY, metadataList, target.constructor);
    } else {
      metadataList = Reflect.getOwnMetadata(ROUTE_KEY, target.constructor);
    }

    metadataList.push(metaData);
  };
}

export function GetRoute(path: string, contentType: ContentTypeKey, needAuth = false) {
  return Route({
    contentType,
    method: MethodKey.Get,
    needAuth,
    path
  });
}

export function PostRoute(path: string, contentType: ContentTypeKey, needAuth = true) {
  return Route({
    contentType,
    method: MethodKey.Post,
    needAuth,
    path
  });
}

export function PutRoute(path: string, contentType: ContentTypeKey, needAuth = true) {
  return Route({
    contentType,
    method: MethodKey.Put,
    needAuth,
    path
  });
}

export function DeleteRoute(path: string, contentType: ContentTypeKey, needAuth = true) {
  return Route({
    contentType,
    method: MethodKey.Delete,
    needAuth,
    path
  });
}

