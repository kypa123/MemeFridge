import { Router } from 'express';
import { userService } from '../services/index.js'
import { isLoggedIn } from '../middlewares/index.js'

const userRouter = Router();

userRouter.get('/', async function(req, res, next){
    try{
        const name = req.query.name;
        const userInfo = await userService.findUser({name});
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
        const userInfo = await userService.findUser({name:req.tokenInfo.name, email: req.tokenInfo.email});
        res
        .status(200)
        .json(userInfo.res[0])
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

userRouter.post('/logout', async function(req, res, next){
    try{
        const message = {message: "ok"}
        res.clearCookie('token').json(message)
    }
    catch(err){
        next(err)
    }
})

export default userRouter