import * as Koa from 'koa';
import router from "./routes";

const app: Koa = new Koa();

app.use(router.routes());

app.listen(3000);
