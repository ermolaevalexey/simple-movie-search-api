import * as Router from '@koa/router';
import * as Koa from 'koa';
import { Controller } from '../types';
import { MoviesRepository } from './repository';


export class MoviesController extends Controller {

    private _router = new Router();

    constructor(
        protected repository: MoviesRepository
    ) {
        super(repository);
        this._router.register('/movies', ['GET'], this.getMovies);
    }

    getMovies = async (ctx: Koa.Context, next: Function) => {
        try {
            const movies = await this.repository.getAll();
            ctx.headers['Content-Type'] = 'application/json; charset=UTF-8';
            ctx.status = 200;
            ctx.body = JSON.stringify(movies);
        } catch (err) {
            ctx.throw(err);
        }
        await next();
    };

    get router(): Router<any, {}> {
        return this._router;
    }
}
