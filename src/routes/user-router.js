import { Router } from 'express';
import {userService} from '../services/index.js'

const userRouter = Router();

userRouter.get('/', async function(req, res, next){
    try{
        const userInfo = await userService.findUser('superuser');
        res.json(userInfo)
    }
    catch(err){
        next(err);
    }
})

userRouter.post('/', async function(req, res, next){
    try{
        const result = await userService.addUser(req.body)
        res.json(result)
    }
    catch(err){
        next(err)
    }
})

export default userRouter