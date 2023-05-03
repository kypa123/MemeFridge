import { userModel } from '../db/index.js'
import bcrypt from 'bcrypt';

class UserService{
    constructor(userModel){
        this.userModel = userModel;
    }

    async addUser(userInfo){
        try{
            const {name, email, password} = userInfo
            const result = await this.userModel.findUser({name, email});

            if (result.rowCount > 0){
                const user = result.rows[0]
                console.log(user)
                let message = ''
                if (user.name == name){
                    console.log('이미 존재하는 아이디')
                    message = '이미 존재하는 아이디입니다.'
                }
                else{
                    console.log('이미 존재하는 이메일')
                    message = '이미 존재하는 이메일입니다.'
                }
                return {message}
            }
            else{
                const hashedPassword = await bcrypt.hash(password, 10)
                const newUser = await this.userModel.addUser({name, hashedPassword, email});
                return newUser
            }
        }
        catch(err){
            return err
        }
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