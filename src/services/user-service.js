import { userModel } from '../db/index.js'
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

    async findUser(userName){
        try{
            const user = await this.userModel.findUser(userName);
            if (user.rowCount == 0){
                return { status: 'error', statusCode: 404, message:'해당 유저는 존재하지 않습니다'}
            }
            else{
                return { status: 'success', statusCode: 200, res : user.rows }
            }
            
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


const userService = new UserService(userModel);

export default userService;