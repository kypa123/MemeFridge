import 'dotenv/config.js';
import dotenv from 'dotenv';
dotenv.config();

const connectionInfo = {
    user: process.env.DB_ID,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
}


export default connectionInfo