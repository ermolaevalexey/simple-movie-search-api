import * as Koa from 'koa';
import * as koaBodyParser from 'koa-bodyparser';
import routes from "./src/routes";

const app: Koa = new Koa();


app.use(koaBodyParser()).use(routes);

app.listen(3000);
