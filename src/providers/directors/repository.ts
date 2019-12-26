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

    async createItem(params: any): Promise<any> {
        try {
            const director = await this.directorsRepository.create(
                params, { fields: Object.keys(params)
            });
            return director;
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    async updateItem(id: string, params: any): Promise<any> {
        try {
            return await this.directorsRepository.update(
                params,
                {
                    where: { id },
                    fields: Object.keys(params)
                }
            );
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    private get store(): Sequelize {
        return this.storeProvider.store;
    }
}
