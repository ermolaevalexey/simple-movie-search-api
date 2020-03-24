import { Column, DataType, Model, Table } from 'sequelize-typescript';


@Table({
    tableName: 'users',
    timestamps: false
})
export default class User extends Model<User> {

    @Column({ type: DataType.UUIDV4, primaryKey: true })
    id: string = this.id;

    @Column({ type: DataType.STRING, allowNull: false })
    // @ts-ignore
    password: string = this.password;

    @Column({ type: DataType.STRING, allowNull: false })
    // @ts-ignore
    email: string = this.email;

    @Column({ type: DataType.STRING, allowNull: true })
    // @ts-ignore
    name: string = this.name;

    @Column({ type: DataType.TEXT, allowNull: true })
    // @ts-ignore
    bio: string = this.name;

    @Column({ type: DataType.ARRAY(DataType.UUIDV4) })
    // @ts-ignore
    favourite_movies: Array<string> = this.favouriteMovies;
}
