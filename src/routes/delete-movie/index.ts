import * as Koa from 'koa';
import { RouteModel } from '../../models/router';

export default {
    path: '/movies/:id',
    methods: ['DELETE'],
    handler: async (ctx: Koa.Context, next: Function) => {
        // TODO implement finding by id logic
        ctx.assert(
            [1, 2, 3, 4, 5].includes(parseInt(ctx.params.id, 10)),
            404,
            JSON.stringify({ message: `No movie with such id: ${ctx.params.id}` })
        );
        ctx.status = 200;
        ctx.body = {
            title: 'Kill Bill',
            year: 2003,
            director: 'Quentin Spielberg'
        };
        ctx.toJSON();
        await next();
    }
} as RouteModel;
