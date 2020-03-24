import * as Koa from 'koa';
import * as jwt from 'jsonwebtoken';
import { Inject, Injectable } from '../../core/di';
import EnvProvider, { TEnvProvider } from '../../core/providers/env';
import { ContentTypeKey, MethodKey } from '../../core/routing/decorators';


export const TMiddlewareProvider = Symbol.for('MiddlewareProvider');

@Injectable()
export class MiddlewareProvider {

    constructor(
        @Inject(TEnvProvider) private envProvider: EnvProvider
    ) {}


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
                console.error(err);
                ctx.status = 502;
                ctx.headers['Content-Type'] = 'application/json';
                ctx.body = JSON.stringify({ error: err });
            }
        }
    }

    verifyToken(): Koa.Middleware {
        return async (ctx: Koa.Context, next: Function) => {
            try {
                const authHeader = ctx.headers.authorization;

                const token = (authHeader || '').replace('Bearer ', '');
                if (!token) {
                    ctx.status = 401;
                    ctx.body = { error: 'No way!' };
                    return;
                }

                const payload = await jwt.verify(token, this.envProvider.authSecret);
                console.log(payload);
                if ((payload as any).type !== 'access') {
                    ctx.status = 401;
                    ctx.body = { error: 'Invalid token' };
                } else {
                    console.log('verified'.toUpperCase())
                    await next();
                }

            } catch (err) {
                if (err instanceof jwt.TokenExpiredError) {
                    ctx.status = 401;
                    ctx.body = { error: 'Token expired!' };
                }

                if (err instanceof jwt.JsonWebTokenError) {
                    ctx.status = 401;
                    ctx.body = { error: 'Invalid token' };
                }


                //throw err;
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
