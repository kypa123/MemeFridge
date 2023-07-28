import dotenv from 'dotenv';
dotenv.config();

export default {
    port: process.env.PORT,
    postgresURL: process.env.POSTGRES_CONNECTION,
    redisURL: process.env.REDIS_CONNECTION,
    cloudinaryConfig: {
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    },
    jwtSecret: process.env.JWT_SECRET_KEY,
    jwtExpire: process.env.JWT_EXPIRE_DATE,
    dataAPI: process.env.DATA_API,
};
