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
        const loginInfo = req.tokenInfo;
        res.json(loginInfo);
    }
    catch(err){
        next(err)
    }
    // req.cookie를 받아서, 서버에서 해당 토큰이 유효한지 확인, 유효하다면 success 200 리턴
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
    }
    catch(err){
        next(err)
    }
})

export default userRouter