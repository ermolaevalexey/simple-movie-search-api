import * as Koa from 'koa';
import { Inject, Injectable } from '../../core/di';
import { ContentTypeKey, Controller, GetRoute, PostRoute, PutRoute } from '../../core/routing/decorators';
import { DirectorsRepository } from './repository';


@Controller('/directors')
@Injectable()
export class DirectorsController {

    constructor(
        @Inject('DirectorsRepository') private directorsRepository: DirectorsRepository
    ) {}

    @GetRoute('/', ContentTypeKey.Json)
    getAll = async (ctx: Koa.Context, next: Function) => {
        ctx.state.data = await this.directorsRepository.getAll();
        await next();
    };

    @GetRoute('/:id', ContentTypeKey.Json)
    getItem = async (ctx: Koa.Context, next: Function) => {
        const director = await this.directorsRepository.getItem(ctx.params.id);
        ctx.state.data = director;
        await next();
    };

    @PostRoute('/', ContentTypeKey.Json)
    createItem = async (ctx: Koa.Context, next: Function) => {
        ctx.state.data = await this.directorsRepository.createItem(ctx.request.body);
        await next();
    };

    @PutRoute('/:id', ContentTypeKey.Json)
    updateItem = async (ctx: Koa.Context, next: Function) => {
        ctx.state.data = await this.directorsRepository.updateItem(
            ctx.params.id,
            ctx.request.body
        );
        await next();
    };
}
