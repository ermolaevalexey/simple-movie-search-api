import * as Router from '@koa/router';
import { Container, Injector, Service } from '../core/di';

@Service()
class Service1 {
    someMethod() {
        console.log('method');
    }
}

@Container(Injector, {
    Service1
})
export class App {
    // services = {};

    private router = new Router();
    constructor(private _services?: any, private store?: any, private injector?: Injector) {
        // console.log(this.services);
        // console.log('srv', this._services);
        console.log(this.injector!.entries());
    }

    logSrv() {
        this._services.Service1.someMethod();
    }
}


// import * as Koa from 'koa';
// import db from '../db';
// import { AppContainer } from './_container';
// import moviesProvider from '../providers/movies';
//
//
// export default (): AppContainer => {
//     const container = new AppContainer(db, new Koa());
//     moviesProvider(container);
//
//     return container;
// };
