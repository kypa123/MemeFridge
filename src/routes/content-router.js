import { Router } from 'express';
import { userService, contentService, nonMemberContentService } from '../services/index.js'
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

contentRouter.get('/user', async function(req, res, next){
    try{
        const userName = req.query.user;
        const userId = await userService.findUser({name: userName});
        const result = await contentService.findByUserId(userId.res[0].id);
        res.json(result);
    }
    catch(err){
        next(err)
    }
})

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
        console.log(req.body);
        const {name, tag, imageURL,uploaderName, uploaderPassword} = req.body;
        //회원 로그인일때
        if(uploaderPassword == ''){
            const user = await userService.findUser({name:uploaderName})
            const result = await contentService.addContent({name, tag, url:imageURL, uploaderId: user.res[0].id, login:true})
            res.json(result);
        }
        //비회원일때
        else{
            const result = await contentService.addContent({name,tag,url:imageURL, uploaderId:0, login: false});
            console.log(result.rows[0])
            const nonMemberResult = await nonMemberContentService.addNonMemberContentInfo({uploaderName, uploaderPassword, contentId: result.rows[0].id})
            console.log(nonMemberResult);
            res.json(result);
        }
    }
    catch(err){
        next(err)
    }
});

contentRouter.delete('/', async function(req, res, next){
    try{
        const id = req.body.id
        const result = await contentService.deleteContent(id);
        res.json(result);
    }
    catch(err){
        next(err)
    }
})



export default contentRouter;