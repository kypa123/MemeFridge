import UserModel from './models/user-model.ts';
import ContentModel from './models/content-model.ts';
import NonMemberContentModel from './models/non-member-content-model.ts';
import BuzzwordModel from './models/buzzword-model.ts';
import connectionInfo from './connectionInfo.ts';
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({ connectionString: connectionInfo });

const userModelInstance = new UserModel(pool);
const contentModelInstance = new ContentModel(pool);
const nonMemberContentModelInstance = new NonMemberContentModel(pool);
const buzzwordModelInstance = new BuzzwordModel(pool);

export {
    userModelInstance,
    contentModelInstance,
    nonMemberContentModelInstance,
    buzzwordModelInstance,
    UserModel,
    ContentModel,
    NonMemberContentModel,
    BuzzwordModel,
};
