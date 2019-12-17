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

export class Container {

    private registry: Map<any, any> = new Map();

    constructor() {
        // this.register({
        //     token: _Container,
        //     useValue: this
        // });
    }

    register(cls: Constructor): void {
        if (!this.isInjectable(cls)) {
            throw new InjectionRegisterError(cls.name);
        }

        this.registry.set(cls.name, cls);
    }


    resolve<T>(token: Constructor): T {
        const cls = this.registry.get(token.name);
        const injections = Reflect.getMetadata(INJECTIONS_KEY, cls) || [];
        const resolved = injections.map((token: Constructor) => {
            return this.resolve(token);
        });
        return new cls(...resolved);
    }

    private isInjectable(cls: Constructor): boolean {
        return !!Reflect.getMetadata(INJECTABLE_KEY, cls);
    }
}
