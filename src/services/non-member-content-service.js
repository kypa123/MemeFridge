import { nonMemberContentModel } from '../db/index.js';

class NonMemberContentService{
    constructor(nonMemberContentModel){
        this.nonMemberContentModel = nonMemberContentModel;
    }

    async addNonMemberContent(nonMemberContentInfo){
        try{
            console.log('논멤버 추가시작')
            const {uploaderName, uploaderPassword, contentId} = nonMemberContentInfo;
            console.log(uploaderName, uploaderPassword, contentId)
            const auth = uploaderName + '_' + uploaderPassword + '_' + contentId.toString();
            console.log(auth);
            const result = await this.nonMemberContentModel.addNonMemberContent({contentId, auth});
            console.log('논멤버 결과:',result);
            return result;
        }
        catch(err){
            return err
        }
    }

    async deleteNonMemberContent(contentId){
        try{
            const result = await this.nonMemberContentModel.deleteNonMemberContent(contentId);
            return result;
        }
        catch(err){
            return err;
        }
    }
}


const nonMemberContentService = new NonMemberContentService(nonMemberContentModel);

export default nonMemberContentService;