import jwt from 'jsonwebtoken';

async function isLoggedIn(req, res, next) {
    console.log('미들웨어')
    const token = req.cookies.token;
    if (!token) {
        res.status(403).json({
            status: 'error',
            statusCode: 403,
            message: '로그인되어 있지 않습니다!',
        });
    }
    
    try{
        const tokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log('정상적으로 토큰을 인식하였습니다')
        console.log(tokenInfo)
        req.tokenInfo = tokenInfo;
        next();
    }
    catch(err){
            req.tokenInfo = err.message
            console.log('토큰이 만료됐거나 문제가있습니다.')
            console.log(err.message)
            next();
        }
}

export default isLoggedIn;
