import { Sequelize } from 'sequelize-typescript';
import { Inject, Injectable } from '../../core/di';
import { StoreProvider, TStoreProvider } from '../db';
import Movie from '../db/models/movie';


@Injectable()
export class MoviesRepository {

    private moviesRepository = this.store.getRepository(Movie);

    constructor(
        @Inject(TStoreProvider) private storeProvider: StoreProvider
    ) {}

    async getAll(): Promise<Array<Movie>> {
        try {
            return await this.moviesRepository.findAll();
        } catch (err) {
            throw err;
        }
    }

    // async log(): Promise<void> {
    //     console.log(
    //         await this.moviesRepository.findAll()
    //     );
    // }
    // async getMovies(): Promise<Array<any>> {
    //     try {
    //         const models: Array<any> = await (this.Movie as any).findAll({
    //             attributes: ['title', 'description', 'year', 'director'],
    //             include: [{
    //                 model: this.store.modelManager.models[1],
    //                 attributes: ['name'],
    //                 where: { id: { [Op.eq]: Sequelize.col('director') } }
    //             }]
    //         });
    //
    //         return models.map(model => ({
    //             title: model.title,
    //             year: model.year,
    //             description: model.description,
    //             director: model.MovieDirectorModel.name
    //         }));
    //     } catch (err) {
    //         throw err;
    //     }
    // }

    private get store(): Sequelize {
        return this.storeProvider.store;
    }
}
