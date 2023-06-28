import pg from 'pg';
import connectionInfo from '../connectionInfo.js';


class NonMemberContentModel{
    private connectionInfo: string
    constructor(connectionInfo:string){
        this.connectionInfo = connectionInfo;
    }
    
    async addNonMemberContent(nonMemberContentInfo:{contentId:number, auth: string}){
        try{
            const connection = new pg.Client(this.connectionInfo)
            await connection.connect()
            const result = await connection.query(`insert into non_member_contents (content_id, id_pwd) values (${nonMemberContentInfo.contentId},'${nonMemberContentInfo.auth}') returning id;`);
            await connection.end()
            return result;
        }
        catch(err){
            return err;
        }
    }

    async deleteNonMemberContent(contentId:number){
        try{
            const connection = new pg.Client(this.connectionInfo)
            await connection.connect()
            const result = await connection.query(`delete from non_member_contents where content_id = ${contentId};`);
            await connection.end()
            return result
        }
        catch(err){
            return err;
        }
    }
}

const nonMemberContentModelInstance = new NonMemberContentModel(connectionInfo);

export {nonMemberContentModelInstance, NonMemberContentModel};