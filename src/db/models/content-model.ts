import pg from 'pg';
import connectionInfo from '../connectionInfo.js';

export class ContentModel{
    private connectionInfo: string
    constructor(connectionInfo:string){
        this.connectionInfo = connectionInfo;
    }

    async findAll(){
        try{
            const connection = new pg.Client(this.connectionInfo);
            await connection.connect();
            const result = await connection.query('select * from contents;');
            await connection.end();
            return result;
        }
        catch(err){
            return err;
        }
    }

    async findByOffset(offset:number){
        try{
            const connection = new pg.Client(this.connectionInfo);
            await connection.connect();
            const result = await connection.query(`select * from contents order by id limit 4 offset ${offset};`);
            await connection.end()
            return result;
        }
        catch(err){
            return err;
        }
    }
    async findByContentId(contentId:number){
        try{
            const connection = new pg.Client(this.connectionInfo);
            await connection.connect();
            const result = await connection.query(`update contents set count = count + 1 where id=${contentId} returning *;`);
            await connection.end()
            return result;
        }
        catch(err){
            return err;
        }
    }
    
    async findByUserId(userId:number){
        try{
            const connection = new pg.Client(this.connectionInfo);
            await connection.connect();
            const result = await connection.query(`select * from contents where creator=${userId}`)
            await connection.end();
            return result;
        }
        catch(err){
            return err;
        }
    }

    async findByTags(tags:string[]){
        try{
            const connection = new pg.Client(this.connectionInfo);
            await connection.connect();
            let query = 'select * from contents where ';
            const string = tags.reduce((acc,curr) => acc + "tag like " + "'%" + curr + "%' and ", '');
            query += string
            query = query.slice(0,-5);
            const result = await connection.query(query);
            await connection.end();
            return result;
        }
        catch(err){
            return err;
        }
    }

    async addContent(contentInfo:{name:string, tag:string, uploaderId:number,url:string, login: boolean}){
        try{
            const {name, tag, uploaderId, url, login } = contentInfo;
            const connection = new pg.Client(this.connectionInfo)
            await connection.connect();
            const result = await connection.query(`insert into contents (title, creator, url, tag, login) values ('${name}', ${uploaderId}, '${url}', '${tag}', '${login}') returning id;`);
            await connection.end();
            return result;
        }
        catch(err){
            console.log(err);
            return err;
        }
    }

    async getRankContents(){
        const connection = new pg.Client(this.connectionInfo)
        await connection.connect();
        const result = await connection.query(`select * from contents order by count desc limit 4;`);
        await connection.end();
        return result.rows;
    }

    async deleteContent(contentId:number){
        const connection = new pg.Client(this.connectionInfo)
        await connection.connect();
        const result = await connection.query(`delete from contents where id=${contentId}`);
        await connection.end();
        return result.rows;
    }
}

const contentModel = new ContentModel(connectionInfo);

export default contentModel