import * as Koa from 'koa';
import { Injectable } from '../../core/di';
import { /*ContentTypeKey,*/ MethodKey } from '../../core/routing/decorators';


@Injectable()
export class MiddlewareProvider {

    setContentType(type: any): Koa.Middleware {
        return this.setHeaders({ 'Content-Type': type });
    }

    setStatus(method: MethodKey): Koa.Middleware {
        const getStatus = (): number => {
            switch (method) {
                case MethodKey.Get:
                case MethodKey.Put:
                    return 200;
                case MethodKey.Post:
                    return 201;
                case MethodKey.Delete:
                    return 204;
            }
        };

        return this.setHttpStatus(getStatus());
    }

    sendData(type: any): Koa.Middleware {
        return async (ctx: Koa.Context, next: Function) => {
            ctx.body = this.transformData(type, ctx.state.data);
        }
    }

    handleError(): Koa.Middleware {
        return async (ctx: Koa.Context, next: Function) => {
            try {
                await next();
            } catch (err) {
                ctx.status = 502;
                ctx.body = err.message;
            }
        }
    }

    private setHeaders(params: Record<string, string>): Koa.Middleware {
        return async (ctx: Koa.Context, next: Function) => {
            ctx.set(params);
            await next();
        }
    }

    private setHttpStatus(status: number): Koa.Middleware {
        return async (ctx: Koa.Context, next: Function) => {
            ctx.status = status;
            await next();
        }
    }

    private transformData(type: any, data: any): any {
        switch (type) {
            case 'application/json':
                return JSON.stringify(data);
            default:
                return data;
        }
    }

}
