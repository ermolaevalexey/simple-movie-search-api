import { DataTypes, Model } from 'sequelize';
import db from '../../db';


export class MovieDirectorModel extends Model {
    public id!: string;
    public name!: string;
    public movies!: Array<string>;
}

MovieDirectorModel.init({
    id: {
        type: DataTypes.UUIDV4.key,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    movies: DataTypes.ARRAY(DataTypes.UUIDV4)
}, { sequelize: db, tableName: 'movie_directors', timestamps: false });
