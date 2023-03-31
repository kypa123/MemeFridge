import { v2 } from 'cloudinary';
import { utf8Decode } from '../utils/useful-functions.js'

const cloudinary = v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});



const upload = function(req, res, next){
    req.pipe(req.busboy)

    req.busboy.on('field',(fieldname,value,info)=>{
        req.body = {...req.body, [fieldname]:value}
    })
    req.busboy.on('file', async function(fieldname, file, filename){
        filename = utf8Decode(filename.filename)
        file.pipe(cloudinary.uploader.upload_stream({folder:'images', public_id: filename},(err,result)=>{
            if (err){
                console.log(err)
            }
            else{
                console.log('ok')
                if (result){
                    req.body = {...req.body, imageURL: result.url}
                    next();
                    // res.imageURL = result.url;
                }
            }
        }))
        .on("finish",()=>{
            console.log("업로드 대성공!")
        })
        .on("error",(err)=>{
            console.log('에러발생')
            console.log(err)
        })

    });
}

export default upload;
