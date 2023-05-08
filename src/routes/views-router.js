import express from 'express'
import path from 'path'
import * as url from 'url';


const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const viewsRouter = express.Router();

viewsRouter.use('/', serveStatic('home'));
viewsRouter.use('/nav',serveStatic('nav'));
viewsRouter.use('/footer',serveStatic('footer'));
viewsRouter.use('/content-modal',serveStatic('content-modal'));
viewsRouter.use('/main', serveStatic('main'));
viewsRouter.use('/images', serveStatic('images'));
viewsRouter.use('/detail/:id', serveStatic('detail'));
viewsRouter.use('/register', serveStatic('register'));
viewsRouter.use('/sign-up', serveStatic('sign-up'));
viewsRouter.use('/login',serveStatic('login'));


viewsRouter.use('/',serveStatic(''));

function serveStatic(resource) {
    const resourcePath = path.join(__dirname, `../views/${resource}`);
    const option = { index: `${resource}.html` };
    return express.static(resourcePath, option);
}

export default viewsRouter;