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

userRouter.post('/auth', async function(req, res, next){
    try{
        const result = await userService.login(req.body);
        console.log(result)
        if(result.status == 'success'){
            res.cookie('token', result.body,{
                expires: new Date(Date.now + 600),
                httpOnly: true,
            })
            .status(200)
            .json(result)
        }
        else{
            res.json(result)
        }
        
    } 
    catch(err){
        next(err)
    }
})

export default userRouter