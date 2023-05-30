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

contentRouter.get('/rank', async function(req,res,next){
    try{
        const result = await contentService.getCacheRankData();
        res.json(result)
    }
    catch(err){
        next(err)
    }
});

contentRouter.get('/id', async function(req, res, next){
    try{
        const id = req.query.id;
        const result = await contentService.findByContentId(id);
        await contentService.updateCacheRankData();
        console.log(result.rows[0]);
        res.json(result.rows[0]);
    }
    catch(err){
        next(err)
    }
});

contentRouter.get('/tags', async function(req, res, next){
    try{
        const tags = req.query.tags.split("-");
        const result = await contentService.findByTags(tags);
        res.json(result)
    }
    catch(err){
        next(err)
    }
})


contentRouter.post('/', upload, async function(req, res, next){
    try{
        const {name, tag, imageURL} = req.body;
        const result = await contentService.addContent({name, tag, url:imageURL})
        res.json(result)
    }
    catch(err){
        next(err)
    }
});


export default contentRouter;