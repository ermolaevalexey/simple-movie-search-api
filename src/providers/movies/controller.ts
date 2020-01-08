import * as Koa from 'koa';
import * as fs from 'fs';
import * as path from 'path';
import { Inject, Injectable } from '../../core/di';
import { ContentTypeKey, Controller, DeleteRoute, GetRoute, PostRoute, PutRoute } from '../../core/routing/decorators';
import { MovieParams } from '../../models/movie';
import { MoviesRepository, TMoviesRepository } from './repository';


export const TMoviesController = Symbol.for('MoviesController');

@Controller('/movies')
@Injectable()
export class MoviesController {

    constructor(
        @Inject(TMoviesRepository) private repository: MoviesRepository
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
            this.uploadPoster(ctx.state.data.id, (ctx.request.files['poster'] as any));
        }
        await next();
    };

    @PutRoute('/:id', ContentTypeKey.Json)
    updateItem = async (ctx: Koa.Context, next: Function) => {
        ctx.state.data = await this.repository.updateItem(
            ctx.params.id,
            ctx.request.body
        );
        if (ctx.request.files && ctx.request.files.poster) {
            this.uploadPoster(ctx.params.id, (ctx.request.files['poster'] as any));
        }
        await next();
    };

    @DeleteRoute('/:id', ContentTypeKey.Json)
    deleteItem = async (ctx: Koa.Context, next: Function) => {
        await this.repository.deleteItem(ctx.params.id);
        await this.deletePoster(ctx.params.id);
        ctx.state.data = { id: ctx.params.id };
        await next();
    };

    private uploadPoster(name: string, data: any): void {
        const staticRoot = path.resolve(__dirname + `../../../../static`);
        const dir = path.resolve(staticRoot + `/posters`);
        if (!fs.existsSync(staticRoot)) {
            fs.mkdirSync(staticRoot, 0o744);
        }
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, 0o744);
        }
        const dt = fs.createReadStream((data['path']));
        const file = fs.createWriteStream(path.resolve(dir + `/${name}.jpg`));

        dt.pipe(file);
    }

    private async deletePoster(name: string): Promise<void> {
        const filePath = path.resolve(__dirname + `../../../../static/posters/${name}.jpg`);

        return new Promise((resolve, reject) => {
            fs.unlink(filePath, (err) => {
                if (err) {
                    reject(err.message);
                } else {
                    resolve();
                }
            });
        });
    }
}
