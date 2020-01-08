import * as fs from "fs";
import * as Koa from 'koa';
import * as path from "path";
import { Inject, Injectable } from '../../core/di';
import { ContentTypeKey, Controller, GetRoute, PostRoute, PutRoute } from '../../core/routing/decorators';
import { DirectorParams } from '../../models/director';
import { DirectorsRepository, TDirectorsRepository } from './repository';


export const TDirectorsController = Symbol.for('DirectorsController');

@Controller('/directors')
@Injectable()
export class DirectorsController {

    constructor(
        @Inject(TDirectorsRepository) private directorsRepository: DirectorsRepository
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
        ctx.state.data = await this.directorsRepository.createItem(ctx.request.body as Partial<DirectorParams>);
        if (ctx.request.files && ctx.request.files.photo) {
            this.uploadPhoto(ctx.state.data.id, (ctx.request.files['photo'] as any));
        }
        await next();
    };

    @PutRoute('/:id', ContentTypeKey.Json)
    updateItem = async (ctx: Koa.Context, next: Function) => {
        ctx.state.data = await this.directorsRepository.updateItem(
            ctx.params.id,
            ctx.request.body
        );
        if (ctx.request.files && ctx.request.files.photo) {
            this.uploadPhoto(ctx.params.id, (ctx.request.files['photo'] as any));
        }
        await next();
    };

    private uploadPhoto(name: string, data: any): void {
        const dt = fs.createReadStream((data['path']));
        const file = fs.createWriteStream(
            path.resolve(__dirname + `../../../../static/photos/${name}.jpg`)
        );

        dt.pipe(file);
    }

    private async deletePhoto(name: string): Promise<void> {
        const filePath = path.resolve(__dirname + `../../../../static/photos/${name}.jpg`);

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
