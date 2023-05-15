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
        req.tokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
    }
    catch(err){
            req.tokenInfo = err.message
        }
    next();
}

export default isLoggedIn;
