import * as Koa from 'koa';
import { Inject, Injectable } from '../../core/di';
import { ContentTypeKey, Controller, GetRoute } from '../../core/routing/decorators';
import { DirectorsRepository } from './repository';


@Controller('/directors')
@Injectable()
export class DirectorsController {

    constructor(
        @Inject('DirectorsRepository') private directorsRepository: DirectorsRepository
    ) {}

    @GetRoute('/', ContentTypeKey.Json)
    getAll = async (ctx: Koa.Context, next: Function) => {
        const directors = await this.directorsRepository.getAll();
        ctx.state.data = directors.map(dir => ({
            id: dir.id,
            name: dir.name,
            movies: dir.movies
        }));
        await next();
    };

    @GetRoute('/:id', ContentTypeKey.Json)
    getItem = async (ctx: Koa.Context, next: Function) => {
        const director = await this.directorsRepository.getItem(ctx.params.id);
        ctx.state.data = director;
        await next();
    };
}
