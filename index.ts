import * as Koa from 'koa';
import * as koaBodyParser from 'koa-bodyparser';
import routes from './src/routes';
import './src/config/env';

const app: Koa = new Koa();

app
    .use(koaBodyParser())
    .use(routes);

app.listen(parseInt(process.env.APP_PORT as string, 10));
