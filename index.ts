import createContainer from './src/app';
import './src/config/env';


(async () => {
    createContainer()
        .runServer(parseInt(process.env.APP_PORT as string, 10));
})();
