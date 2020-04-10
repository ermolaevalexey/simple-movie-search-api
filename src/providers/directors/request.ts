import * as Koa from 'koa';
import { File, Files } from 'formidable';


export interface DirectorParams {
  id: string;
  name: string;
  movies: string[];
}

export interface DirectorsRequest extends Koa.Request {
  body: Partial<DirectorParams>;
  files?: Files & { photo: File };
}

export interface DirectorsContext extends Koa.Context {
  request: DirectorsRequest;
}
