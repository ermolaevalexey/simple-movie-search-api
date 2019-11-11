import * as Koa from 'koa';
import { RouteModel } from "../models/router";

export const getMovies: RouteModel = {
    path: '/movies',
    methods: ['GET'],
    handler: (ctx, next) => {
        ctx.headers['Content-Type'] = 'application/json';
        ctx.body = JSON.stringify([{
            title: 'Kill Bill',
            year: '2003',
            director: 'Quentin Spielberg'
        }]);
    }
};
