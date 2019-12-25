import '../../config/env';
import { Injectable } from '../../di';


@Injectable()
export default class EnvProvider {
    env = process.env.NODE_ENV;
    appPort = parseInt(process.env.APP_PORT as string, 10);
    store = {
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    };
}
