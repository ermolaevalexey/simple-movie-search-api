import * as Router from '@koa/router';
import { Model } from 'sequelize';


export abstract class Repository<T extends Model> {
    constructor(
        private store: T
    )  {}

    public async getAll() {}
    public async getItem() {}
}

export abstract class Route {
    private path!: string;
    private method!: 'get' | 'post' | 'put' | 'delete';
    private handler!: () => Promise<any>;

    constructor(
        private repository: Repository<any>,
        private router: Router
    ) {}

    get route(): Router {
        return this.router[this.method](
            this.path,
            this.handler
        );
    }
}
