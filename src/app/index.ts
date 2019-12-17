import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as Router from '@koa/router';
import { Sequelize } from 'sequelize';
import db from '../db';


export class App {
    private server = new Koa();
    private router = new Router();

    private store = db;
    constructor(
        private _services?: any,
    ) {}

    run() {
        this.server
            .use(bodyParser())
            .use(this.router.routes())
            .listen(3000);
    }
}
