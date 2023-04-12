import { Router } from 'express';
import { contentService } from '../services/index.js'
import { upload } from '../middlewares/index.js';
const contentRouter = Router();


contentRouter.get('/', async function(req, res, next){
    try{
        const offset = Number(req.query.offset)
        const result = await contentService.findByOffset(offset)
        res.json(result)
    }
    catch(err){
        next(err);
    }
});

contentRouter.post('/', upload, async function(req, res, next){
    try{
        const {name, desc, imageURL} = req.body;
        const result = await contentService.addContent({name, desc, url:imageURL})
        res.json({ok})
    }
    catch(err){
        next(err)
    }
});

export default contentRouter;