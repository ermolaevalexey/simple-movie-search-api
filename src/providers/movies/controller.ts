import * as Koa from 'koa';
import { MoviesContext } from './request';
import { ContentTypeKey, Controller, DeleteRoute, GetRoute, PostRoute, PutRoute } from '../../core/routing/decorators';
import { Inject, Injectable } from '../../core/di';
import { MoviesRepository, TMoviesRepository } from './repository';
import { StaticStorageProvider, TStaticStorageProvider } from '../../core/providers/static-storage';


export const TMoviesController = Symbol.for('MoviesController');

@Controller('/movies')
@Injectable()
export class MoviesController {

  constructor(
    @Inject(TMoviesRepository) private repository: MoviesRepository,
    @Inject(TStaticStorageProvider) private staticStorage: StaticStorageProvider
  ) {}

  @GetRoute('/', ContentTypeKey.Json)
  getAll = async (ctx: Koa.Context, next: () => Promise<unknown>) => {
    ctx.state.data = await this.repository.getAll();
    await next();
  };

  @GetRoute('/:id', ContentTypeKey.Json)
  getItem = async (ctx: Koa.Context, next: () => Promise<unknown>) => {
    const movie = await this.repository.getItem(ctx.params.id);

    ctx.state.data = movie;
    await next();
  };

  @PostRoute('/', ContentTypeKey.Json)
  createItem = async (ctx: MoviesContext, next: () => Promise<unknown>) => {
    ctx.state.data = await this.repository.createItem(ctx.request.body);
    if (ctx.request.files && ctx.request.files.poster) {
      this.uploadPoster(ctx.state.data.id, ctx.request.files.poster);
    }
    await next();
  };

  @PutRoute('/:id', ContentTypeKey.Json)
  updateItem = async (ctx: MoviesContext, next: () => Promise<unknown>) => {
    ctx.state.data = await this.repository.updateItem(
      ctx.params.id,
      ctx.request.body
    );
    if (ctx.request.files && ctx.request.files.poster) {
      this.uploadPoster(ctx.params.id, ctx.request.files.poster);
    }
    await next();
  };

  @DeleteRoute('/:id', ContentTypeKey.Json)
  deleteItem = async (ctx: Koa.Context, next: () => Promise<unknown>) => {
    await this.repository.deleteItem(ctx.params.id);
    await this.deletePoster(ctx.params.id);
    ctx.state.data = { id: ctx.params.id };
    await next();
  };

  private uploadPoster(name: string, data: any): void {
    this.staticStorage.uploadFile(name, 'posters', data);
  }

  private async deletePoster(name: string): Promise<void> {
    await this.staticStorage.deleteFile(name, 'posters');
  }
}
