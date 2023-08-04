import ContentService from './content-service.ts';
import UserService from './user-service.ts';
import NonMemberContentService from './non-member-content-service.ts';
import BuzzwordService from './buzzword-service.ts';
import * as db from '../db/index.ts';
import { createClient } from 'redis';

const contentServiceInstance = new ContentService(
    db.contentModelInstance,
    createClient,
);
const userServiceInstance = new UserService(db.userModelInstance);
const nonMemberContentServiceInstance = new NonMemberContentService(
    db.nonMemberContentModelInstance,
);
const buzzwordServiceInstance = new BuzzwordService(
    db.buzzwordModelInstance,
    createClient,
);
export {
    contentServiceInstance,
    userServiceInstance,
    nonMemberContentServiceInstance,
    buzzwordServiceInstance,
};
