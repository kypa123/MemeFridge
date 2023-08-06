import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { TokenRequest, UserToken } from '../interfaces/index.ts';
import * as configFile from '../config/index.ts';

async function isLoggedIn(
    req: TokenRequest,
    res: Response,
    next: NextFunction,
) {
    if (!req.cookies.token) {
        res.status(403).json({
            status: 'error',
            statusCode: 403,
            message: '로그인되어 있지 않습니다!',
        });
    } else {
        try {
            const token = req.cookies.token;
            const tokenInfo = jwt.verify(token, configFile.default.jwtSecret);
            console.log('정상적으로 토큰을 인식하였습니다');
            req.tokenInfo = tokenInfo as UserToken;
            next();
        } catch (err) {
            res.json({
                status: 'error',
                statusCode: 401,
                message: err.message,
            });
        }
    }
}

export default isLoggedIn;
