// import createContainer from './src/app';
import './src/config/env';
import { App } from './src/app';
import { Injector } from './src/core/di';
// console.log(process.env);
//
// (async () => {
//     createContainer()
//         .runServer(parseInt(process.env.APP_PORT as string, 10));
// })();
function bootstrap() {
    const injector = new Injector();
    const entryPoint = injector.resolve(App);
    console.log(entryPoint);
    (entryPoint as App).logSrv();
}

bootstrap();
// const app = new App();
// console.log(app);
