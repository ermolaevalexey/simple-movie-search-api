import * as Koa from 'koa';
import { RouteModel } from '../../models/router';
import { UpdateMovieParams } from './request';


export default {
    path: '/movies/:id',
    methods: ['PUT'],
    handler: async (ctx: Koa.Context, next: Function) => {
        // TODO implement finding by id logic
        ctx.assert(
            [1, 2, 3, 4, 5].includes(parseInt(ctx.params.id, 10)),
            404,
            JSON.stringify({ message: `No movie with such id: ${ctx.params.id}` })
        );
        ctx.headers['Content-Type'] = 'application/json; charset=UTF-8';
        ctx.status = 200;
        ctx.body = {
            title: 'Kill Bill',
            year: 2003,
            ...ctx.request.body
        };
        ctx.toJSON();
        await next();
    }
} as RouteModel<UpdateMovieParams>;
