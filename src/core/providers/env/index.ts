import '../../config/env';
import { Injectable } from '../../di';

@Injectable()
export default class EnvProvider {
    env = process.env.NODE_ENV as string;
    appPort = parseInt(process.env.PORT as string, 10);
    store = {
        name: process.env.DB_NAME as string,
        user: process.env.DB_USER as string,
        password: process.env.DB_PASSWORD as string
    };
}
