import { AppContainer } from '../../app';
import { MoviesRepository } from './repository';


export default (container: AppContainer) => {
    container.registerService('MoviesRepository', (c) => new MoviesRepository(c.store));
}
