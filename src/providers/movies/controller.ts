import * as Koa from 'koa';
import { Inject, Injectable } from '../../core/di';
import { Controller, GetRoute } from '../../core/routing/decorators';
import { MoviesRepository } from './repository';


@Controller('/movies')
@Injectable()
export class MoviesController {
    constructor(
        @Inject('MoviesRepository') private repository: MoviesRepository
    ) {}

    @GetRoute('/')
    getAll = async (ctx: Koa.Context, next: Function) => {
        try {
            const movies = await this.repository.getAll();
            // ctx.response.s.()
            ctx.body = JSON.stringify(
                movies.map((item) => ({
                    id: item.id,
                    title: item.title,
                    year: item.year
                }))
            );

            await next();
        } catch (err) {
            throw err;
        }
    }

    // getMovies = async (ctx: any, next: any) => {
    //     try {
    //         const movies = await this.repository.getMovies();
    //         ctx.headers['Content-Type'] = 'application/json; charset=UTF-8';
    //         ctx.status = 200;
    //         ctx.body = JSON.stringify(movies);
    //     } catch (err) {
    //         ctx.throw(err);
    //     }
    //     await next();
    // }
}
