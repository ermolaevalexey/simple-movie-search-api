import { Sequelize } from 'sequelize';
import '../config/env';


const db = new Sequelize(
    process.env.DB_NAME as string,
    process.env.DB_USER as string,
    process.env.DB_PASSWORD,
    {
        dialect: 'postgres',
        logging: process.env.NODE_ENV === 'production'
            ? undefined
            : console.log
    }
);

export default db;
