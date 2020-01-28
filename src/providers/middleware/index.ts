import * as Koa from 'koa';
import { Injectable } from '../../core/di';
import { ContentTypeKey, MethodKey } from '../../core/routing/decorators';


export const TMiddlewareProvider = Symbol.for('MiddlewareProvider');

@Injectable()
export class MiddlewareProvider {

    setContentType(type: ContentTypeKey): Koa.Middleware {
        return async (ctx: Koa.Context, next: Function) => {
            ctx.type = type;
            await next();
        }
    }

    setStatus(method: MethodKey): Koa.Middleware {
        const getStatus = (): (ctx: Koa.Context) => number => {
            return (ctx: Koa.Context) => {
                if ([
                    MethodKey.Get.toUpperCase(),
                    MethodKey.Put.toUpperCase(),
                    MethodKey.Delete.toUpperCase()].includes(ctx.method) &&
                    ctx.state.data === null
                ) {
                    return 404;
                }
                switch (method) {
                    case MethodKey.Get:
                    case MethodKey.Put:
                        return 200;
                    case MethodKey.Post:
                        return 201;
                    case MethodKey.Delete:
                        return 204;
                }
            }
        };

        return this.setHttpStatus(getStatus());
    }

    sendData(): Koa.Middleware {
        return async (ctx: Koa.Context, next: Function) => {
            if (ctx.type !== ContentTypeKey.Image) {
                ctx.body = this.transformData((ctx.type as ContentTypeKey), ctx.state.data);
            } else {
                if (!ctx.state.data || !ctx.state.data.found) {
                    ctx.status = 404;
                }
                ctx.type = (ctx.state.data && ctx.state.data.ext) || ContentTypeKey.Html;
                ctx.body = (ctx.state.data && ctx.state.data.source) || null;
            }
        }
    }

    handleError(): Koa.Middleware {
        return async (ctx: Koa.Context, next: Function) => {
            try {
                await next();
            } catch (err) {
                ctx.status = 502;
                ctx.headers['Content-Type'] = 'application/json';
                ctx.body = JSON.stringify({ error: err });
            }
        }
    }

    private setHeaders(params: Record<string, string>): Koa.Middleware {
        return async (ctx: Koa.Context, next: Function) => {
            ctx.set(params);
            await next();
        }
    }

    private setHttpStatus(getStatus: (ctx: Koa.Context) => number): Koa.Middleware {
        return async (ctx: Koa.Context, next: Function) => {
            ctx.status = getStatus(ctx);
            await next();
        }
    }

    private transformData(type: ContentTypeKey, data: any): any {
        switch (type) {
            case ContentTypeKey.Json:
                return JSON.stringify(data);
            default:
                return data;
        }
    }

}
