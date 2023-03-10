import { contentModel } from '../db/index.js'

class ContentService{
    constructor(contentModel){
        this.contentModel = contentModel;
    }

    async addUser(userInfo){
        const {name, password, email} = userInfo
        const user = await this.userModel.findUser(name);
        if (user){
            throw new Error(
                '이미 존재하는 아이디입니다'
            );
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await this.userModel.addUser({name, hashedPassword, email});
        console.log(newUser);
        return newUser

    }

    async findByOffset(offset){
        const result = await this.contentModel.findByOffset(offset*4);
        return result;
    }

    async findUser(userName){
        try{
            const user = await this.userModel.findUser(userName);
            return user;
        }
        catch(err){
            return err;
        }
    }

    async updateUser(userInfo){
        const user = await this.userModel.updateUser(userInfo);
        return user;
    }

    async deleteUser(userId){
        const result = await this.userModel.deleteUser(userId);
        return result;
    }
}


const contentService = new ContentService(contentModel);

export default contentService;