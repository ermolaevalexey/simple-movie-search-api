import * as Koa from 'koa';

export function getMovies(): any {
    return {
        path: '/movies',
        handler: (ctx, next) => {
            ctx.headers['Content-Type'] = 'application/json';
            ctx.body = JSON.stringify([{
                title: 'Kill Bill',
                year: '2003',
                director: 'Quentin Tarantino'
            }]);
        }
    };
}
