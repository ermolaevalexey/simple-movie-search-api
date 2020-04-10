import { Column, DataType, Model, Table } from 'sequelize-typescript';


@Table({
  tableName: 'users',
  timestamps: false
})
export default class User extends Model<User> {

  @Column({ type: DataType.UUIDV4, primaryKey: true })
  id: string = this.id;

  @Column({ type: DataType.STRING, allowNull: false })
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  password: string = this.password;

  @Column({ type: DataType.STRING, allowNull: false })
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  email: string = this.email;

  @Column({ type: DataType.STRING, allowNull: true })
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  name: string = this.name;

  @Column({ type: DataType.TEXT, allowNull: true })
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  bio: string = this.name;

  @Column({ type: DataType.ARRAY(DataType.UUIDV4) })
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  // tslint:disable-next-line:variable-name
  favourite_movies: string[] = this.favouriteMovies;
}
