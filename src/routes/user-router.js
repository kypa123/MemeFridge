import { Router } from 'express';
import userModel from '../db/models/user-model.js'

const userRouter = Router();

userRouter.get('/', async function(req, res, next){
    try{
        const userInfo = await userModel.findUser(22);
        if (!userInfo.rows){
            throw new Error('없는 회원입니다');
        }
        else{
            res.json(userInfo.rows)
        }
    }
    catch(err){
        next(err);
    }
})

userRouter.post('/',async function(req, res, next){

})

export {userRouter}