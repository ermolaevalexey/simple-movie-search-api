import { RouteModel } from "../../models/router";

export default {
    path: '/movies',
    methods: ['GET'],
    handler: async (ctx, next) => {
        ctx.headers['Content-Type'] = 'application/json; charset=UTF-8';
        ctx.body = JSON.stringify([{
            title: 'Kill Bill',
            year: '2003',
            director: 'Quentin Spielberg'
        }]);
        await next();
    }
} as RouteModel;
