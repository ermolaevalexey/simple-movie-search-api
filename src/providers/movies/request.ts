import * as Koa from 'koa';
import { Files, File } from 'formidable';


export interface MovieParams {
    id: string;
    title: string;
    year: string;
    description: string;
    director: string;
}

export interface MoviesRequest extends Koa.Request {
    body: Partial<MovieParams>;
    files?: Files & { poster: File };
}

export interface MoviesContext extends Koa.Context {
    request: MoviesRequest;
}
