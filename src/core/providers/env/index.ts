import '../../config/env';
import { Injectable } from '../../di';

@Injectable()
export default class EnvProvider {
    env = process.env.NODE_ENV as string;
    appPort = parseInt(process.env.PORT as string, 10);
    store = {
        dbname: process.env.dbname as string,
        user: process.env.user as string,
        password: process.env.password as string,
        host: process.env.host as string
    };
}
