import pg from 'pg';
import connectionInfo from '../connectionInfo.js';


class NonMemberModel{
    constructor(connectionInfo){
        this.connectionInfo = connectionInfo
    }
    
    async addNonMemberInfo(userId){
        try{
            const connection = new pg.Client(this.connectionInfo)
            await connection.connect()
            const result = await connection.query(`insert into non_members (user_id, content_count) values (${userId},1) returning id;`);
            await connection.end()
            return result;
        }
        catch(err){
            return err;
        }
    }

    async deleteNonMemberInfo(nonMemberId){
        try{
            const connection = new pg.Client(this.connectionInfo)
            await connection.connect()
            const result = await connection.query(`delete from non_members where id = ${nonMemberId};`);
            await connection.end()
            return result
        }
        catch(err){
            return err;
        }
    }

    async increaseContentCount(nonMemberId){
        try{
            const connection = new pg.Client(this.connectionInfo)
            await connection.connect()
            const result = await connection.query(`update non_members set content_count = content_count + 1 where user_id = ${nonMemberId};`);
            await connection.end()
            return result
        }
        catch(err){
            return err
        }
    }

    async decreaseContentCount(nonMemberId){
        try{
            const connection = new pg.Client(this.connectionInfo)
            await connection.connect()
            const result = await connection.query(`update table non_members set content_count = content_count - 1 where user_id = ${nonMemberId} returning content_count;`);
            await connection.end()
            return result
        }
        catch(err){
            return err
        }
    }
}

const nonMemberModel = new NonMemberModel(connectionInfo);

export default nonMemberModel;