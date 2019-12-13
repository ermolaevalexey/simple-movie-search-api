import 'reflect-metadata';


export const Injector = new class {
    resolve<T>(target: any): T {
        const tokens = Reflect.getMetadata('design:paramtypes', target) || [];
        const injections = tokens.map((token: string) => Injector.resolve<any>(token));

        return new target(...injections);
    }
};
