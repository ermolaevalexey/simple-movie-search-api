import * as Router from '@koa/router';
import { Inject, Injectable } from '../../core/di';
import { MoviesRepository } from './repository';


@Injectable()
export class MoviesController {
    constructor(
        @Inject('MoviesRepository') private repository: MoviesRepository,
        @Inject('Router') private router: Router
    ) {
        this.router.get('/movies', this.getAll);
    }

    getAll = async (ctx: any, next: any) => {
        try {
            const movies = await this.repository.getAll();
            console.log(movies.map((item) => ({
                id: item.id,
                title: item.title,
                year: item.year
            })));
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
