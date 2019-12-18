import { Sequelize, DataTypes, Model, Op, Deferrable } from 'sequelize';
import { Inject, Injectable } from '../../core/di';
import { StoreProvider, TStoreProvider } from '../db';


@Injectable()
export class MoviesRepository {

    private Movie = this.initMovieModel();
    private MovieDirector = this.initMovieDirectorModel();

    constructor(
        @Inject(TStoreProvider) private storeProvider: StoreProvider
    ) {}

    async getMovies(): Promise<Array<any>> {
        try {
            const models: Array<any> = await (this.Movie as any).findAll({
                attributes: ['title', 'description', 'year', 'director'],
                include: [{
                    model: this.MovieDirector,
                    attributes: ['name'],
                    where: { id: { [Op.eq]: Sequelize.col('director') } }
                }]
            });

            return models.map(model => ({
                title: model.title,
                year: model.year,
                description: model.description,
                director: model.MovieDirectorModel.name
            }));
        } catch (err) {
            throw err;
        }
    }

    private initMovieModel(): typeof Model {
        return this.store.define(
            'movie',
            {
            id: {
                type: DataTypes.UUIDV4.key,
                primaryKey: true
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false
            },
            year: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            description: DataTypes.STRING,
            director: {
                type: DataTypes.UUIDV4,
                references: {
                    model: this.MovieDirector,
                    key: 'id',
                    deferrable: Deferrable.INITIALLY_IMMEDIATE()
                }
            }
        }, {
            tableName: 'movies',
            timestamps: false
        });
    }

    private initMovieDirectorModel(): typeof Model {
        return this.store.define('movieDirector', {
            id: {
                type: DataTypes.UUIDV4.key,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            movies: DataTypes.ARRAY(DataTypes.UUIDV4)
        }, {
            tableName: 'movie_directors',
            timestamps: false
        });
    }

    private get store(): Sequelize {
        return this.storeProvider.store;
    }
}
