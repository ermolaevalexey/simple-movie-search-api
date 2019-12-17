import './src/config/env';
import { Container } from './src/core/di';
import { Inject, Injectable } from './src/core/di';

@Injectable()
class Foo {
    foo = 'foo';
}

@Injectable()
class Service {
    constructor(@Inject(Foo) public foo: Foo) {
        this.method();
    }

    method() {
        console.log(this.foo.foo);
    }
}


function bootstrap() {
    const container = new Container();
    container.register(Foo);
    container.register(Service);

    container.resolve(Service);

}

bootstrap();
