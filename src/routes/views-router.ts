import express from 'express';
import * as path from 'path';
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const viewsRouter = express.Router();

viewsRouter.use('/', serveStatic('main'));
viewsRouter.use('/nav', serveStatic('nav'));
viewsRouter.use('/footer', serveStatic('footer'));
viewsRouter.use('/content-modal', serveStatic('content-modal'));
viewsRouter.use('/main', serveStatic('main'));
viewsRouter.use('/images', serveStatic('images'));
viewsRouter.use('/detail/:id', serveStatic('detail'));
viewsRouter.use('/register', serveStatic('register'));
viewsRouter.use('/sign-up', serveStatic('sign-up'));
viewsRouter.use('/login', serveStatic('login'));
viewsRouter.use('/search/tags/:tags', serveStatic('search'));
viewsRouter.use('/content-add', serveStatic('content-add'));
viewsRouter.use('/my-page', serveStatic('my-page'));
viewsRouter.use('/buzzword', serveStatic('buzzword'));

viewsRouter.use('/', serveStatic(''));

function serveStatic(resource: string) {
    const resourcePath = path.join(__dirname, `../views/${resource}`);
    const option = { index: `${resource}.html` };
    return express.static(resourcePath, option);
}

export default viewsRouter;
