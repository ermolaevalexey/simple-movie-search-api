import * as Router from '@koa/router';
import { getMovies } from "./get-movies";

const router = new Router();

router.get(getMovies().path, getMovies().handler);
export default router;
