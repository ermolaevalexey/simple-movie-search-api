import db from '../db';
import { AppContainer } from './container';
import moviesProvider from '../providers/movies';


export default (): AppContainer => {
    const container = new AppContainer(db);
    moviesProvider(container);

    return container;
};
