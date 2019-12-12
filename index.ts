import createContainer from './src/app';
import './src/config/env';
// const app: Koa = new Koa();

(async () => {
    createContainer()
        .runServer(parseInt(process.env.APP_PORT as string, 10));
})();

// app
//     .use(koaBodyParser())
//     .use(routes);
//
// app.listen(parseInt(process.env.APP_PORT as string, 10));
