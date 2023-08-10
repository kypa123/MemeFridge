import { Request, Response } from 'express';
import {
    userServiceInstance,
    buzzwordServiceInstance,
    nonMemberContentServiceInstance,
} from '../services/index.ts';

export async function getBuzzwordsByOffset(req: Request, res: Response) {
    const offset = Number(req.query.offset);
    const result = await buzzwordServiceInstance.findByOffset(offset);
    res.json(result);
}

export async function getBuzzwordsFromDataAPI(req: Request, res: Response) {
    const result = await buzzwordServiceInstance.addDatasFromAPI();
    res.json(result);
}
export async function getBuzzwordsById(req: Request, res: Response) {
    const id = parseInt(req.query.id as string);
    const result = await buzzwordServiceInstance.findByBuzzwordId(id);
    res.json(result);
}

export async function getBuzzwordsByUserId(req: Request, res: Response) {
    const userName = (req.query.user as string) || null;
    const userId = await userServiceInstance.findUser({
        name: userName,
        email: null,
    });
    if (userId.status == 'error') {
        res.status(404).json(userId);
    } else {
        const result = await buzzwordServiceInstance.findByUserId(
            userId.res[0].id,
        );
        res.json(result);
    }
}

export async function getBuzzwordsByTags(req: Request, res: Response) {
    const requestTag = req.query.tags as string;
    const tags: string[] = requestTag.split('-');
    const result = await buzzwordServiceInstance.findByTags(tags);
    res.json(result);
}

export async function addBuzzword(req: Request, res: Response) {
    const { name, tag, descr, uploaderName, uploaderPassword } = req.body;
    if (uploaderPassword == '') {
        const user = await userServiceInstance.findUser({
            name: uploaderName,
            email: null,
        });
        const result = await buzzwordServiceInstance.addBuzzword({
            name,
            tag,
            uploaderId: user.res[0].id,
            descr,
        });
        res.json(result);
    } else {
        const result = await buzzwordServiceInstance.addBuzzword({
            name,
            tag,
            uploaderId: 0,
            descr,
        });
        const nonMemberResult =
            await nonMemberContentServiceInstance.addNonMemberContent({
                uploaderName,
                uploaderPassword,
                contentId: result.rows[0].id,
            });
        res.json(result);
    }
}

export async function deleteBuzzword(req: Request, res: Response) {
    const id = req.body.id;
    const result = await buzzwordServiceInstance.deleteBuzzword(id);
    res.json(result);
}
