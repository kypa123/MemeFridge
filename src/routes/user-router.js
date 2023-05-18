import { Router } from 'express';
import { userService } from '../services/index.js'
import { isLoggedIn } from '../middlewares/index.js'

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

userRouter.get('/auth', isLoggedIn, async function(req,res,next){
    try{
        const userInfo = req.tokenInfo
        res
        .status(200)
        .json(userInfo)
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
                httpOnly: true,
            })
            .status(200)
            .json(result)
        }
        else{
            res.status(404)
            .json(result)
        }
        
    } 
    catch(err){
        next(err)
    }
})

userRouter.delete('/auth',async function(req, res, next){
    try{
        res.clearCookie("token")
        .status(200)
        .redirect('/')
    }
    catch(err){
        next(err)
    }
})

export default userRouter