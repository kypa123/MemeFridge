import pg from 'pg';
import connectionInfo from '../connectionInfo.js';


class NonMemberContentModel{
    constructor(connectionInfo){
        this.connectionInfo = connectionInfo
    }
    
    async addNonMemberContent(nonMemberContentInfo){
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

    async deleteNonMemberContent(contentId){
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

const nonMemberContentModel = new NonMemberContentModel(connectionInfo);

export default nonMemberContentModel;