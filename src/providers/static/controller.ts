import * as Koa from 'koa';
import * as fs from 'fs';
import { Inject, Injectable } from '../../core/di';
import { StaticStorageProvider, TStaticStorageProvider } from '../../core/providers/static-storage';
import { ContentTypeKey, Controller, GetRoute } from '../../core/routing/decorators';

export const TStaticController = Symbol.for('StaticController');

@Controller('')
@Injectable()
export class StaticController {

    constructor(
        @Inject(TStaticStorageProvider) private staticProvider: StaticStorageProvider
    ) {}

    @GetRoute('/posters/:filename', ContentTypeKey.Image)
    getMoviePoster = async (ctx: Koa.Context, next: Function) => {
        const data = await this.staticProvider.getFile(ctx.params.filename, 'posters');
        ctx.state.data = data;
        await next();
    };

    @GetRoute('/photos/:filename', ContentTypeKey.Image)
    getDirectorPhoto = async (ctx: Koa.Context, next: Function) => {
        const data = await this.staticProvider.getFile(ctx.params.filename, 'photos');
        ctx.state.data = data;
        await next();
    };
}
