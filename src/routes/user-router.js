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

userRouter.post('/',async function(req, res, next){
    const { name, password, email } = req.body;
})

export default userRouter