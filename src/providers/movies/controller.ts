import * as Koa from 'koa';
import { Inject, Injectable } from '../../core/di';
import { ContentTypeKey, Controller, GetRoute } from '../../core/routing/decorators';
import { MoviesRepository } from './repository';


@Controller('/movies')
@Injectable()
export class MoviesController {
    constructor(
        @Inject('MoviesRepository') private repository: MoviesRepository
    ) {}

    @GetRoute('/', ContentTypeKey.Json)
    getAll = async (ctx: Koa.Context, next: Function) => {
        const movies = await this.repository.getAll();
        ctx.state.data = movies.map((item) => ({
            id: item.id,
            title: item.title,
            year: item.year
        }));
        await next();
    };

    @GetRoute('/:id', ContentTypeKey.Json)
    getItem = async (ctx: Koa.Context, next: Function) => {
        const movie = await this.repository.getItem(ctx.params.id);
        ctx.state.data = movie;
        await next();
    };
}
