import './src/config/env';
import { Container } from './src/core/di';
import { Inject, Injectable } from './src/core/di';

const TService = Symbol.for('Service');
const TFoo = Symbol.for('Foo');
const TSomeData = Symbol.for('SomeData');
@Injectable()
class Foo {
    foo = 'foo';
}

@Injectable()
class SomeData {
    private data = [1, 2, 3, 4, 5];

    getItem(index: number): number {
        return this.data[index] || this.data[0];
    };

    getAll(): Array<number> {
        return this.data;
    };
}

@Injectable()
class Service {
    constructor(@Inject(TSomeData) private someData: SomeData) {}

    run() {
        console.log(this.someData.getAll());
        console.log(this.someData.getItem(4));
    }
}


function bootstrap() {
    const container = new Container();

    container.register([
        {
            token: TFoo,
            _class: Foo
        },
        {
            token: TSomeData,
            _class: SomeData
        },
        {
            token: TService,
            _class: Service
        }
    ]);

    const app: Service = container.resolve(TService);
    app.run();
}

bootstrap();
