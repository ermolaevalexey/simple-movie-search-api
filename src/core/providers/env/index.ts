import '../../config/env';
import { Injectable } from '../../di';

export const TEnvProvider = Symbol.for('EnvProvider');

@Injectable()
export default class EnvProvider {
    env = process.env.NODE_ENV as string;
    appPort = parseInt(process.env.PORT as string, 10);
    dbUrl = process.env.DATABASE_URL as string;
}
