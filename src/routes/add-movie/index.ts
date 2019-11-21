import * as Koa from 'koa';
import { RouteModel } from "../../models/router";
import { AddMovieParams } from "./request";

export default {
    path: '/movies',
    methods: ['POST'],
    handler: async (ctx: Koa.Context, next: Function) => {
        const params: AddMovieParams = ctx.request.body;
        ctx.assert(
            (params.title && params.year),
            400,
            JSON.stringify({ message: 'Wrong movie params!' })
        );
        ctx.status = 201;
        ctx.body = params;
        ctx.toJSON();

        await next();
    }
} as RouteModel<AddMovieParams>;
