import dotenv from 'dotenv';
dotenv.config();

const connectionInfo = process.env.POSTGRES_CONNECTION


export default connectionInfo