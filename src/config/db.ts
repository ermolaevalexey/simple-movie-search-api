import { Sequelize } from 'sequelize';
import './env';


const db = new Sequelize(
    process.env.DB_NAME as string,
    process.env.DB_USER as string,
    process.env.DB_PASSWORD,
    { dialect: 'postgres' }
);

export default db;
