import { Sequelize } from 'sequelize-typescript';
import { Injectable } from '../../di';
import '../../config/env';


export const TStoreProvider = Symbol.for('StoreProvider');

@Injectable()
export class StoreProvider {
    private _store: Sequelize = this.initStore();

    get store(): Sequelize {
        return this._store;
    }

    private initStore(): Sequelize {
        return new Sequelize(
            process.env.DB_NAME as string,
            process.env.DB_USER as string,
            process.env.DB_PASSWORD,
            {
                dialect: 'postgres',
                models: [__dirname + '/models/**/*.ts'],
                repositoryMode: true,
                logging: process.env.NODE_ENV === 'production'
                    ? undefined
                    : console.log
            }
        );
    }
}
