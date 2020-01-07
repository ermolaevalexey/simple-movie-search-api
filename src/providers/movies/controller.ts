import * as Koa from 'koa';
import * as fs from 'fs';
import * as path from 'path';
import { Inject, Injectable } from '../../core/di';
import { ContentTypeKey, Controller, DeleteRoute, GetRoute, PostRoute, PutRoute } from '../../core/routing/decorators';
import { MovieParams } from '../../models/movie';
import { MoviesRepository } from './repository';


@Controller('/movies')
@Injectable()
export class MoviesController {

    constructor(
        @Inject('MoviesRepository') private repository: MoviesRepository
    ) {}

    @GetRoute('/', ContentTypeKey.Json)
    getAll = async (ctx: Koa.Context, next: Function) => {
        ctx.state.data = await this.repository.getAll();
        await next();
    };

    @GetRoute('/:id', ContentTypeKey.Json)
    getItem = async (ctx: Koa.Context, next: Function) => {
        const movie = await this.repository.getItem(ctx.params.id);
        ctx.state.data = movie;
        await next();
    };

    @PostRoute('/', ContentTypeKey.Json)
    createItem = async (ctx: Koa.Context, next: Function) => {
        ctx.state.data = await this.repository.createItem(ctx.request.body as Partial<MovieParams>);
        if (ctx.request.files && ctx.request.files.poster) {
            // console.log((ctx.request.files['poster']).);
            this.uploadPoster(ctx.state.data.id, (ctx.request.files['poster'] as any)![0]);
        }
        await next();
    };

    @PutRoute('/:id', ContentTypeKey.Json)
    updateItem = async (ctx: Koa.Context, next: Function) => {
        ctx.state.data = await this.repository.updateItem(
            ctx.params.id,
            ctx.request.body
        );
        await next();
    };

    @DeleteRoute('/:id', ContentTypeKey.Json)
    deleteItem = async (ctx: Koa.Context, next: Function) => {
        await this.repository.deleteItem(ctx.params.id);
        ctx.state.data = { id: ctx.params.id };
        await next();
    };

    private uploadPoster(name: string, data: File): any {
        const dt = fs.createReadStream(data.name);
        const file = fs.createWriteStream(
            path.resolve(__dirname + `../../../../static/posters/${name}.jpg`)
        );

        dt.pipe(file);
    }
}
