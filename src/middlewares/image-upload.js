import { v2 } from 'cloudinary';

const cloudinary = v2;

cloudinary.config(process.env.CloudinaryConfig);