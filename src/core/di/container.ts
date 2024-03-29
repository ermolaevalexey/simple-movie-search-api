// TODO: refactor this trash
// eslint-disable-next-line max-classes-per-file
import { isClass } from '../utils/di';
import { INJECTABLE_KEY, INJECTIONS_KEY } from './decorators';
import 'reflect-metadata';

export type Constructor = new (...args: any[]) => any;

export class InjectionRegisterError extends Error {
  constructor(className: string) {
    super();
    this.message = `Error while registering dependency! \n
      Dependency ${className} is not injectable!`;
  }
}
export enum LifeTime {
  Persistent,
  PerRequest
}
export interface RegistryProvider {
  token: any;
  _class?: Constructor;
  _value?: any;
  _factory?: (...args: any[]) => any;
  injections?: any[];
  lifeTime?: LifeTime;
}

// tslint:disable-next-line:max-classes-per-file
export class RegistryItem {
  public token: any;
  public value: any;
  public instance: any;
  public injections!: any[];
  public lifeTime!: LifeTime;
}

export const TContainer = Symbol.for('Container');

// tslint:disable-next-line:max-classes-per-file
export class Container {

  private _registry: Map<any, RegistryItem | any> = new Map();

  constructor() {
    this.register({
      _value: this,
      token: TContainer
    });
  }

  register(registration: RegistryProvider | RegistryProvider[]): void {
    if (Array.isArray(registration)) {
      this.registerAll(registration);
    } else {
      this.registerItem(registration);
    }
  }

  registerAll(registration: RegistryProvider[]): void {
    registration.forEach(provider => this.registerItem(provider));
  }

  registerItem(registration: RegistryProvider): void {
    const { token, _class, _value, _factory, injections } = registration;
    const hasClass = !!_class;

    if (hasClass && !this.isInjectable(_class!)) {
      throw new InjectionRegisterError(_class!.name);
    }

    const registryItem = new RegistryItem();
    const tokens: any[] = injections || [];

    registryItem.token = token;

    if (!!_value) {
      registryItem.instance = _value;
    }

    registryItem.value = _class || _factory;

    if (_class) {
      const injs = Reflect.getMetadata(INJECTIONS_KEY, _class);
      registryItem.injections = isClass
        ? (injs || []).map((inj: any, idx: any) => ({
          paramIdx: idx,
          token: inj
        }))
        : tokens.map((t, idx) => ({
          paramIdx: idx,
          token: t
        }));
    }
    registryItem.lifeTime = registration.lifeTime || LifeTime.Persistent;
    // eslint-disable-next-line no-underscore-dangle
    this._registry.set(token, registryItem);
  }
  resolve<T>(token: any): T {

    // eslint-disable-next-line no-underscore-dangle
    const regItem = this._registry.get(token);

    if (!!regItem.instance) {
      return regItem.instance;
    }

    const params: any[] = [];
    const injections = regItem.injections || [];
    const resolved = injections.map((i: any) => this.resolve(i.token));

    injections.forEach((i: any, idx: number) => {
      params[i.paramIdx] = resolved[idx];
    });

    const instance = isClass(regItem.value)
      ? new regItem.value(...params)
      : regItem.value(...params);

    if (regItem.lifeTime === LifeTime.Persistent) {
      regItem.instance = instance;
    }

    return instance;
  }

  get registry(): Map<any, RegistryItem | any> {
    // eslint-disable-next-line no-underscore-dangle
    return this._registry;
  }

  private isInjectable(cls: Constructor): boolean {
    return !!Reflect.getMetadata(INJECTABLE_KEY, cls);
  }
}
