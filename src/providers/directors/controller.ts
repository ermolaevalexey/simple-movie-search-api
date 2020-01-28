import * as Koa from 'koa';
import { Inject, Injectable } from '../../core/di';
import { StaticStorageProvider, TStaticStorageProvider } from '../../core/providers/static-storage';
import { ContentTypeKey, Controller, GetRoute, PostRoute, PutRoute } from '../../core/routing/decorators';
import { DirectorsRepository, TDirectorsRepository } from './repository';
import { DirectorsContext } from './request';


export const TDirectorsController = Symbol.for('DirectorsController');

@Controller('/directors')
@Injectable()
export class DirectorsController {

    constructor(
        @Inject(TDirectorsRepository) private directorsRepository: DirectorsRepository,
        @Inject(TStaticStorageProvider) private staticStorage: StaticStorageProvider
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
    createItem = async (ctx: DirectorsContext, next: Function) => {
        ctx.state.data = await this.directorsRepository.createItem(ctx.request.body);

        if (ctx.request.files && ctx.request.files.photo) {
            this.uploadPhoto(ctx.state.data.id, ctx.request.files.photo);
        }
        await next();
    };

    @PutRoute('/:id', ContentTypeKey.Json)
    updateItem = async (ctx: DirectorsContext, next: Function) => {
        ctx.state.data = await this.directorsRepository.updateItem(
            ctx.params.id,
            ctx.request.body
        );

        if (ctx.request.files && ctx.request.files.photo) {
            this.uploadPhoto(ctx.params.id, ctx.request.files.photo);
        }
        await next();
    };

    private uploadPhoto(name: string, data: any): void {
        this.staticStorage.uploadFile(name, 'photos', data);
    }
}
