import UserModel from './models/user-model.ts';
import ContentModel from './models/content-model.ts';
import NonMemberContentModel from './models/non-member-content-model.ts';
import BuzzwordModel from './models/buzzword-model.ts';
import connectionInfo from './connectionInfo.ts';

const userModelInstance = new UserModel(connectionInfo);
const contentModelInstance = new ContentModel(connectionInfo);
const nonMemberContentModelInstance = new NonMemberContentModel(connectionInfo);
const buzzwordModelInstance = new BuzzwordModel(connectionInfo);

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
