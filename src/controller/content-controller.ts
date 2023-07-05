import { Request, Response } from 'express';
import { userService, contentService, nonMemberContentService } from '../services/index.ts'


export async function getContentsByOffset(req:Request, res:Response){
    const offset = Number(req.query.offset)
    const result = await contentService.findByOffset(offset)
    res.json(result)
}

export async function getRankData(req:Request, res:Response){
    const result = await contentService.getCacheRankData();
    res.json(result)
}

export async function getRecentTags(req: Request, res:Response){
    const result = await contentService.getRecentTagsData();
    res.json(result);
}

export async function getContentsById(req:Request, res:Response){
    const id = parseInt(req.query.id as string);
    const result = await contentService.findByContentId(id);
    const newTag = result.rows[0].tag.split(' ')[0]
    await contentService.updateCacheRankData();
    await contentService.updateRecentTagsData(newTag)
    
    res.json(result.rows[0]);
}


export async function getContentsByUser(req:Request, res:Response){
    const userName = req.query.user as string || null;
    const userId = await userService.findUser({name: userName, email: null});
    const result = await contentService.findByUserId(userId.res[0].id);
    res.json(result);
}

export async function getContentsByTags(req:Request, res:Response){
    const requestTag = req.query.tags as string
    const tags: string [] = requestTag.split('-');
    const result = await contentService.findByTags(tags);
    res.json(result)
}

export async function addContent(req:Request, res:Response){
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

export async function deleteContent(req:Request, res:Response){
    const id = req.body.id
    const result = await contentService.deleteContent(id);
    res.json(result);
}