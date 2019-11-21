import routeRegistry from './route-registry';
import getMovies from './get-movies';
import addMovie from './add-movie';

routeRegistry.registerRoute(getMovies);
routeRegistry.registerRoute(addMovie);
export default routeRegistry.routes;
