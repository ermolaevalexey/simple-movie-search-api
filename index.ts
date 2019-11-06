import * as Koa from 'koa';

const app: Koa = new Koa();

interface SumParams {
    arg: string;
}

function sum(a: number): number {
    return a + 2;
}

app.use((ctx: Koa.Context) => {
    const queryArg: SumParams = ctx.query;
    if (!queryArg.arg || isNaN(parseInt(queryArg.arg, 10))) {
        ctx.status = 400;
        ctx.body = 'Arg is not accepted';
    } else {
        ctx.body = `The sum is: ${sum(parseInt(queryArg.arg, 10))}`;
    }
});

app.listen(3000);