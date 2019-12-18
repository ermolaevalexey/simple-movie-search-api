import { AppContainer } from '../../../providers/app/_container';
import { MoviesController } from './controller';
import { MoviesRepository } from './repository';


export default (container: AppContainer) => {
    container
        .registerService('MoviesRepository', (c) => new MoviesRepository(c.store))
        // @ts-ignore
        .registerService('MoviesController', (c) => new MoviesController(c['MoviesRepository' as any] as any));
}
