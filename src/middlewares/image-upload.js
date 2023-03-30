import { v2 } from 'cloudinary';
import { utf8Decode } from '../utils/useful-functions.js'

const cloudinary = v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryUploader = cloudinary.uploader.upload_stream({folder:'images'},(err,res)=>{
    if (err){
        console.log(err)
    }
    else{
        console.log('ok')
        return res.url;
    }
});

const upload = function(req, res, next){
    req.pipe(req.busboy)
    

    req.busboy.on('file', function(fieldname, file, filename){
        filename = utf8Decode(filename.filename)
        file.pipe(cloudinaryUploader)
        .on("finish",()=>{
            console.log("업로드 대성공!")
        })
        .on("error",(err)=>{
            console.log('에러발생')
            console.log(err)
        })
        .pipe(res)
        .on("finish",()=>{
            console.log('업로드도 성공했고, 다음에 싣기도 성공')
            next()
        })
        .on("error",()=>{
            console.log("무언가 문제가 발생했습니다")
        })
    });
}

export default upload;
