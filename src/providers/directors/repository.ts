import { Sequelize } from 'sequelize-typescript';
import { Inject, Injectable } from '../../core/di';
import { StoreProvider, TStoreProvider } from '../../core/providers/db';
import Director from '../../models/director';


@Injectable()
export class DirectorsRepository {

    private directorsRepository = this.store.getRepository(Director);

    constructor(
        @Inject(TStoreProvider) private storeProvider: StoreProvider
    ) {}


    async getAll(): Promise<Array<any>> {
        try {
            return await this.directorsRepository.findAll();
        } catch (err) {
            console.error(err);
            return [];
        }
    }

    async getItem(id: string): Promise<any> {
        try {
            return await this.directorsRepository.findByPk(id);
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    private get store(): Sequelize {
        return this.storeProvider.store;
    }
}
