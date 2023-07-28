import { Request, Response } from 'express';
import {
    userService,
    buzzwordService,
    nonMemberContentService,
} from '../services/index.ts';

export async function getBuzzwordsFromDataAPI(req: Request, res: Response) {
    const result = await buzzwordService.addDatasFromAPI();
    res.json(result);
}
export async function getBuzzwordsById(req: Request, res: Response) {
    const id = parseInt(req.query.id as string);
    const result = await buzzwordService.findByBuzzwordId(id);
    res.json(result);
}

export async function getBuzzwordsByUserId(req: Request, res: Response) {
    const userName = (req.query.user as string) || null;
    const userId = await userService.findUser({ name: userName, email: null });
    const result = await buzzwordService.findByUserId(userId.res[0].id);
    res.json(result);
}

export async function getBuzzwordsByTags(req: Request, res: Response) {
    const requestTag = req.query.tags as string;
    const tags: string[] = requestTag.split('-');
    const result = await buzzwordService.findByTags(tags);
    res.json(result);
}

export async function addBuzzword(req: Request, res: Response) {
    const { name, tag, descr, uploaderName, uploaderPassword } = req.body;
    if (uploaderPassword == '') {
        const user = await userService.findUser({
            name: uploaderName,
            email: null,
        });
        const result = await buzzwordService.addBuzzword({
            name,
            tag,
            uploaderId: user.res[0].id,
            descr,
        });
        res.json(result);
    } else {
        const result = await buzzwordService.addBuzzword({
            name,
            tag,
            uploaderId: 0,
            descr,
        });
        const nonMemberResult =
            await nonMemberContentService.addNonMemberContent({
                uploaderName,
                uploaderPassword,
                contentId: result.rows[0].id,
            });
        res.json(result);
    }
}

export async function deleteBuzzword(req: Request, res: Response) {
    const id = req.body.id;
    const result = await buzzwordService.deleteBuzzword(id);
    res.json(result);
}
