import { nonMemberModel } from '../db/index.js';

class NonMemberService{
    constructor(nonMemberModel){
        this.nonMemberModel = nonMemberModel;
    }

    async addNonMemberInfo(userId){
        try{
            const result = await this.nonMemberModel.addNonMemberInfo(userId);
            return result;
        }
        catch(err){
            return err
        }
    }

    async increaseContentCount(nonMemberId){
        try{
            const result = await this.nonMemberModel.increaseContentCount(nonMemberId);
            return result;
        }
        catch(err){
            return err;
        }
    }

    async decreaseContentCount(nonMemberId){
        try{
            const result = await this.nonMemberModel.decreaseContentCount(nonMemberId);
            if(user.rows.content_count == 0){
                return await this.nonMemberModel.deleteNonMemberInfo(nonMemberId);
            }
            return result;
        }
        catch(err){
            return err;
        }
    }
}


const nonMemberService = new NonMemberService(nonMemberModel);

export default nonMemberService;