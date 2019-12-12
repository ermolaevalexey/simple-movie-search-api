import { DataTypes, InitOptions, ModelAttributes, Sequelize } from 'sequelize';
import { MovieDirectorModel } from '../../models/director';
import { Movie, MovieModel } from '../../models/movie';
import { Repository } from '../types';


export class MoviesRepository extends Repository<MovieModel> {
    constructor(
        protected store: Sequelize
    ) {
        super(store);
        this.initModel();
    }


    async getAll(): Promise<Array<Movie>> {
        return await MovieModel.getMovies();
    }

    async getItem(): Promise<any> {
        return undefined;
    }

    private initModel(): void {
        MovieModel.init(
            this.modelAttributes,
            this.initModelOptions
        );

        MovieModel.belongsTo(MovieDirectorModel, { foreignKey: 'director' });
    }

    private get modelAttributes(): ModelAttributes {
        return {
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
            director: DataTypes.UUIDV4
        };
    }

    private get initModelOptions(): InitOptions {
        return {
            sequelize: this.store,
            tableName: 'movies',
            timestamps: false
        };
    }
}
