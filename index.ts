import './src/config/env';
import { Container } from './src/core/di';
import { Inject, Injectable } from './src/core/di';

const TService = Symbol.for('Service');
const TFoo = Symbol.for('Foo');

@Injectable()
class Foo {
    foo = 'foo';
}

@Injectable()
class Service {
    constructor(@Inject(TFoo) public foo: Foo) {
        this.method();
    }

    method() {
        console.log(this.foo.foo);
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
            token: TService,
            _class: Service
        }
    ]);

    container.resolve(TService);

}

bootstrap();
