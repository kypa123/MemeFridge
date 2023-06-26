import jwt from 'jsonwebtoken';

async function isLoggedIn(req, res, next) {
    console.log('미들웨어')
    if (!req.cookies.token) {
        res.json({
            status: 'error',
            statusCode: 403,
            message: '로그인되어 있지 않습니다!',
        });
    }
    else{
        try{
            const token = req.cookies.token;
            const tokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
            console.log('정상적으로 토큰을 인식하였습니다')
            console.log(tokenInfo)
            req.tokenInfo = tokenInfo;
            next();
        }
        catch(err){
                res.json({
                    status: 'error',
                    statusCode:401,
                    message: err.message
                })
            }
    }
}

export default isLoggedIn;