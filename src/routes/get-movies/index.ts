import * as Koa from 'koa';
import { RouteModel } from "../../models/router";

export default {
    path: '/movies',
    methods: ['GET'],
    handler: async (ctx: Koa.Context, next: Function) => {
        ctx.headers['Content-Type'] = 'application/json; charset=UTF-8';
        ctx.body = JSON.stringify([{
            title: 'Kill Bill',
            year: '2003',
            director: 'Quentin Spielberg'
        }]);
        await next();
    }
} as RouteModel;
