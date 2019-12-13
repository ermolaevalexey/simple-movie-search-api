import * as Koa from 'koa';
import { RouteModel } from '../../models/router';
import { MovieModel } from '../../models/movie';


export default {
    path: '/movies',
    methods: ['GET'],
    handler: async (ctx: Koa.Context, next: Function) => {
        try {
            const movies = await MovieModel.getMovies();
            ctx.headers['Content-Type'] = 'application/json; charset=UTF-8';
            ctx.status = 200;
            ctx.body = JSON.stringify(movies);
        } catch (err) {
            ctx.throw(err);
        }
        await next();
    }
} as RouteModel;
