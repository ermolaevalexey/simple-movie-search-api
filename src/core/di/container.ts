import 'reflect-metadata';
import { INJECTABLE_KEY, INJECTIONS_KEY } from './decorators';


export interface Constructor {
    new (...args: any[]): any;
}

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

export class RegistryItem {
    public token: any;
    public value: any;
    public instance: any;
    public injections!: any[];
    public lifeTime!: LifeTime;
}

export class Container {

    private registry: Map<any, RegistryItem | any> = new Map();

    constructor() {
        // this.register({
        //     token: _Container,
        //     useValue: this
        // });
    }

    register(registration: RegistryProvider | Array<RegistryProvider>): void {
        if (Array.isArray(registration)) {
            this.registerAll(registration);
        } else {
            this.registerItem(registration)
        }
    }

    registerAll(registration: Array<RegistryProvider>): void {
        registration.forEach(provider => this.registerItem(provider));
    }

    registerItem(registration: RegistryProvider): void {
        const { token, _class, _value, _factory, injections } = registration;
        const isClass = !!_class;

        if (isClass && !this.isInjectable(_class!)) {
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
            const injs = Reflect.getMetadata(INJECTIONS_KEY, _class!);
            registryItem.injections = isClass
                ? (injs || []).map((inj: any, idx: any) => ({
                    token: inj,
                    paramIdx: idx
                }))
                : tokens.map((t, idx) => ({
                    token: t,
                    paramIdx: idx
                }));
        }
        registryItem.lifeTime = registration.lifeTime || LifeTime.Persistent;
        this.registry.set(token, registryItem);
    }

    resolve<T>(token: any): T {
        const regItem = this.registry.get(token);

        if (!!regItem.instance) {
            return regItem.instance;
        }

        const isClass = this.isClass(regItem.value);
        const params: any[] = [];
        const injections = regItem.injections || [];
        const resolved = injections.map((i: any) => this.resolve(i.token));

        injections.forEach((i: any, idx: number) => {
            params[i.paramIdx] = resolved[idx];
        });

        const instance = isClass
            ? new regItem.value(...params)
            : regItem.value(...params);

        if (regItem.lifeTime === LifeTime.Persistent) {
            regItem.instance = instance;
        }

        return instance;
    }

    private isInjectable(cls: Constructor): boolean {
        return !!Reflect.getMetadata(INJECTABLE_KEY, cls);
    }

    private isClass(token: any): boolean {
        try {
            Reflect.construct(String, [], token);
        } catch (err) {
            return false;
        }

        return true;
    }
}
