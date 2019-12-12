import * as Router from '@koa/router';
import { Sequelize, Model } from 'sequelize';


export abstract class Repository<T extends Model> {
    constructor(
        protected store: Sequelize
    )  {}

    public abstract async getAll(): Promise<any>;
    public abstract async getItem(): Promise<any>;
}

export abstract class Controller {
    constructor(
        protected repository: Repository<any>,
    ) {}

    public abstract get router(): Router;
}

