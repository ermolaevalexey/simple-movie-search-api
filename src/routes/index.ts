import * as Router from '@koa/router';
import { getMovies } from "./get-movies";

const router = new Router();

router.register(getMovies.path, getMovies.methods, getMovies.handler);
export default router;
