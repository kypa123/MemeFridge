import { UserModel } from '../db/index.js'
import bcrypt from 'bcrypt';

class UserService{
    constructor(userModel){
        this.userModel = userModel;
    }

    async addUser(userInfo){
        const {id, password, email} = userInfo
        const user = await this.userModel.findUser(id);
        if (user){
            throw new Error(
                '이미 존재하는 아이디입니다'
            );
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await this.userModel.addUser({id, hashedPassword, email});
        console.log(newUser);
        return newUser

    }

    async findUser(userId){
        try{
            const user = await this.userModel.findUser(userId);
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


const userService = new UserService(UserModel);

export default userService;