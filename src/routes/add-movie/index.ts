import * as Koa from 'koa';
import { RouteModel } from "../../models/router";
import { AddMovieParams } from "./request";

export default {
    path: '/movies',
    methods: ['POST'],
    handler: async (ctx: Koa.Context, next) => {
        const params: AddMovieParams = ctx.request.body;
        ctx.assert(
            (params.title && params.year),
            400,
            JSON.stringify({ message: 'Wrong movie params!' })
        );
        ctx.response.status = 201;
        ctx.response.body = params;
        ctx.response.toJSON();

        await next();
    }
} as RouteModel<AddMovieParams>;
