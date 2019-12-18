import { Sequelize } from 'sequelize';
import { Injectable } from '../../core/di';
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
                logging: process.env.NODE_ENV === 'production'
                    ? undefined
                    : console.log
            }
        );
    }
}
