import express from 'express'
import path from 'path'
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const viewsRouter = express.Router();

viewsRouter.use('/images', serveStatic('images'))
viewsRouter.use('/', serveStatic('home'));
viewsRouter.use('/detail', serveStatic('detail'))

function serveStatic(resource) {
    const resourcePath = path.join(__dirname, `../views/${resource}`);
    const option = { index: `${resource}.html` };
    return express.static(resourcePath, option);
}

export { viewsRouter };