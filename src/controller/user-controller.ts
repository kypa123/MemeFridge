import { Request, Response } from 'express';
import { userServiceInstance } from '../services/index.ts';
import { TokenRequest } from '../interfaces/index.ts';

export async function getUser(req: TokenRequest, res: Response): Promise<void> {
    const name = (req.query.name as string) || '';
    const email = (req.query.email as string) || '';
    const userInfo = await userServiceInstance.findUser({ name, email });
    res.json(userInfo);
}

export async function addUser(req: Request, res: Response) {
    const result = await userServiceInstance.addUser(req.body);
    if (result.status == 'error') {
        res.status(409).json(result);
    } else {
        res.status(200).json(result);
    }
}

export async function getLoggedInUser(req: TokenRequest, res: Response) {
    const userInfo = await userServiceInstance.findUser({
        name: req.tokenInfo.name,
        email: req.tokenInfo.email,
    });
    res.status(200).json(userInfo.res[0]);
}

export async function login(req: Request, res: Response) {
    const result = await userServiceInstance.login(req.body);
    if (result.status == 'success') {
        res.cookie('token', result.body, {
            httpOnly: true,
        })
            .status(200)
            .json(result);
    } else {
        res.status(404).json(result);
    }
}

export async function logout(req: Request, res: Response) {
    const message = { message: 'ok' };
    res.clearCookie('token').json(message);
}

export async function deleteUser(req: Request, res: Response) {
    const userName = req.query.name as string;
    const result = await userServiceInstance.deleteUser(userName);
    res.status(result.status).json(result);
}
