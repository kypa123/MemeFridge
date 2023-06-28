import { v2 } from 'cloudinary';
import { Stream } from 'stream';
import { InfoObject, FileNameObject } from '../interfaces/index.ts';

const cloudinary = v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});




const upload = function(req: any, res: any, next: any){
    req.pipe(req.busboy)

    req.busboy.on('field',(fieldname:string,value:string,info:InfoObject)=>{
        req.body = {...req.body, [fieldname]:value}
    })
    req.busboy.on('file', async function(fieldname:string, file:Stream, filename:FileNameObject){
        file.pipe(cloudinary.uploader.upload_stream({folder:'images'},(err,result)=>{
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
