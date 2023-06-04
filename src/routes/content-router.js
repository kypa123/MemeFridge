import { Router } from 'express';
import { userService, contentService, nonMemberService } from '../services/index.js'
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
            const nonMemberName = "NM_" + uploaderName
            const check = await userService.findUser({name:nonMemberName});
            let id;
            let resu;
            //비회원 로그인이면서 같은아이디가 없을때
            if(check.statusCode == 404){
                const nonMember = await userService.addUser({name:nonMemberName, password: uploaderPassword, email: ''});
                id = nonMember.rows[0].id;
                resu = await nonMemberService.addNonMemberInfo(id);
            }
            //비회원 로그인이지만 이미 똑같은 아이디를 만들었을 때
            else{
                id = check.res[0].id;
                resu = await nonMemberService.increaseContentCount(id);
            }
            const result = await contentService.addContent({name,tag,url:imageURL, uploaderId:id, login: false})
            res.json(result);
        }
    }
    catch(err){
        next(err)
    }
});


export default contentRouter;