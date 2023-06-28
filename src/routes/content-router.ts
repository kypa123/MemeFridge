import { Request, Response, NextFunction, Router } from 'express';
import { userService, contentService, nonMemberContentService } from '../services/index.ts'
import { upload } from '../middlewares/index.ts';
const contentRouter = Router();


contentRouter.get('/', async function(req:Request, res:Response, next:NextFunction){
    try{
        const offset = Number(req.query.offset)
        const result = await contentService.findByOffset(offset)
        res.json(result)
    }
    catch(err){
        next(err);
    }
});

contentRouter.get('/rank', async function(req:Request, res:Response, next:NextFunction){
    try{
        const result = await contentService.getCacheRankData();
        res.json(result)
    }
    catch(err){
        next(err)
    }
});

contentRouter.get('/id', async function(req:Request, res:Response, next:NextFunction){
    try{
        const id = parseInt(req.query.id as string);
        const result = await contentService.findByContentId(id);
        await contentService.updateCacheRankData();
        console.log(result.rows[0]);
        res.json(result.rows[0]);
    }
    catch(err){
        next(err)
    }
});

contentRouter.get('/user', async function(req:Request, res:Response, next:NextFunction){
    try{
        const userName = req.query.user as string || null;
        const userId = await userService.findUser({name: userName, email: null});
        const result = await contentService.findByUserId(userId.res[0].id);
        res.json(result);
    }
    catch(err){
        next(err)
    }
})

contentRouter.get('/tags', async function(req:Request, res:Response, next:NextFunction){
    try{
        const requestTag = req.query.tags as string
        const tags: string [] = requestTag.split('-');
        const result = await contentService.findByTags(tags);
        res.json(result)
    }
    catch(err){
        next(err)
    }
})


contentRouter.post('/', upload, async function(req:Request, res:Response, next:NextFunction){
    try{
        const {name, tag, imageURL,uploaderName, uploaderPassword} = req.body;
        //회원 로그인일때
        if(uploaderPassword == ''){
            const user = await userService.findUser({name:uploaderName, email: null})
            const result = await contentService.addContent({name, tag, url:imageURL, uploaderId: user.res[0].id, login:true})
            res.json(result);
        }
        //비회원일때
        else{
            const result = await contentService.addContent({name,tag,url:imageURL, uploaderId:0, login: false});
            const nonMemberResult = await nonMemberContentService.addNonMemberContent({uploaderName, uploaderPassword, contentId: result.rows[0].id})
            res.json(result);
        }
    }
    catch(err){
        next(err)
    }
});

contentRouter.delete('/', async function(req:Request, res:Response, next:NextFunction){
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