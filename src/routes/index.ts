import routeRegistry from '../helpers/route-registry';
import getMovies from './get-movies';
import addMovie from './add-movie';
import updateMovie from './update-movie';
import deleteMovie from './delete-movie';


routeRegistry.registerRoute(getMovies);
routeRegistry.registerRoute(addMovie);
routeRegistry.registerRoute(updateMovie);
routeRegistry.registerRoute(deleteMovie);

export default routeRegistry.routes;
