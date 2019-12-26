import { Sequelize } from 'sequelize-typescript';
import { Inject, Injectable } from '../../core/di';
import { StoreProvider, TStoreProvider } from '../../core/providers/db';
import Movie, { MovieParams } from '../../models/movie';


@Injectable()
export class MoviesRepository {

    private moviesRepository = this.store.getRepository(Movie);

    constructor(
        @Inject(TStoreProvider) private storeProvider: StoreProvider
    ) {}

    async getAll(): Promise<Array<Movie>> {
        return await this.moviesRepository.findAll();
    }

    async getItem(id: string): Promise<Movie> {
        return await this.moviesRepository.findByPk(id);
    }

    async createItem(params: Partial<MovieParams>): Promise<Movie> {
        return await this.moviesRepository.create(
            params, { fields: Object.keys(params) }
        );
    }

    async updateItem(id: string, params: Partial<MovieParams>): Promise<boolean> {
        const [ updated ] = await this.moviesRepository.update(
            params,
            {
                where: { id },
                fields: Object.keys(params)
            }
        );

        return Boolean(updated);
    }

    async deleteItem(id: string): Promise<Movie | null> {
        try {
            return await this.moviesRepository.destroy(
                { where: { id } }
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
