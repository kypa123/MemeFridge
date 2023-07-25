import jwt from 'jsonwebtoken';
import { Request } from 'express';

export interface UserToken extends jwt.JwtPayload {
    name: string;
    email: string;
}

export interface InfoObject {
    nameTruncated: boolean;
    valueTruncated: false;
    encoding: string;
    mimeType: string;
}

export interface FileNameObject {
    filename: string;
    encoding: string;
    mimeType: string;
}

export interface TokenRequest extends Request {
    tokenInfo: UserToken;
}
