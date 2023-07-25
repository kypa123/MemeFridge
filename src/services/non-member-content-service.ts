import {
    nonMemberContentModelInstance,
    NonMemberContentModel,
} from '../db/index.js';

class NonMemberContentService {
    private nonMemberContentModel: NonMemberContentModel;
    constructor(nonMemberContentModel: NonMemberContentModel) {
        this.nonMemberContentModel = nonMemberContentModel;
    }

    async addNonMemberContent(nonMemberContentInfo: {
        uploaderName: string;
        uploaderPassword: string;
        contentId: number;
    }) {
        try {
            const { uploaderName, uploaderPassword, contentId } =
                nonMemberContentInfo;
            console.log(uploaderName, uploaderPassword, contentId);
            const auth =
                uploaderName +
                '_' +
                uploaderPassword +
                '_' +
                contentId.toString();
            const result = await this.nonMemberContentModel.addNonMemberContent(
                { contentId, auth },
            );
            return result;
        } catch (err) {
            return err;
        }
    }

    async deleteNonMemberContent(contentId: number) {
        try {
            const result =
                await this.nonMemberContentModel.deleteNonMemberContent(
                    contentId,
                );
            return result;
        } catch (err) {
            return err;
        }
    }
}

const nonMemberContentService = new NonMemberContentService(
    nonMemberContentModelInstance,
);

export default nonMemberContentService;
