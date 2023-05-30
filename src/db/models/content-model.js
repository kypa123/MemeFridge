import pg from 'pg';
import connectionInfo from '../connectionInfo.js';

export class ContentModel{
    constructor(connectionInfo){
        this.connectioninfo = connectionInfo;
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

    async findByOffset(offset){
        try{
            const connection = new pg.Client(this.connectioninfo);
            await connection.connect();
            const result = await connection.query(`select * from contents order by id limit 4 offset ${offset};`);
            await connection.end()
            return result;
        }
        catch(err){
            return err;
        }
    }
    async findByContentId(contentId){
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
    
    async findByUserId(userId){
        try{
            const connection = new pg.Client(this.connectionInfo);
            await connection.connect();
            const result = await connection.query(`select * from contents inner join users on contents.creator = users.id where creator=${userId}`)
            await connection.end();
            return result;
        }
        catch(err){
            return err;
        }
    }

    async findByTags(tags){
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

    async addContent(contentInfo){
        try{
            const {name, tag, url} = contentInfo;
            const connection = new pg.Client(this.conenctionInfo)
            await connection.connect();
            const result = await connection.query(`insert into contents (title, creator, url, tag) values ('${name}', 2, '${url}', '${tag}')`)
            await connection.end();
            return result;
        }
        catch(err){
            return err;
        }
    }

    async getRankContents(){
        const connection = new pg.Client(this.conenctionInfo)
        await connection.connect();
        const result = await connection.query(`select * from contents order by count desc limit 4;`);
        await connection.end();
        return result.rows;
    }
}

const contentModel = new ContentModel(connectionInfo);

export default contentModel