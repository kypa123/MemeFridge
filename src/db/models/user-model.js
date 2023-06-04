import pg from 'pg';
import connectionInfo from '../connectionInfo.js';


class UserModel{
    constructor(connectionInfo){
        this.connectionInfo = connectionInfo
    }
    
    async findUser(userInfo){
        try{
            const name = userInfo.name || ''
            const email = userInfo.email || ''
            const connection = new pg.Client(this.connectionInfo)
            await connection.connect()
            const result = await connection.query(`select * from users where name='${name}' or email='${email}'`);
            await connection.end()
            return result
        }
        catch(err){
            return err
        }
    }

    async addUser(userInfo){
        try{
            const connection = new pg.Client(this.connectionInfo)
            await connection.connect()
            const result = await connection.query(`insert into users (name, password,email) values ('${userInfo.name}','${userInfo.hashedPassword}','${userInfo.email}') returning id;`);
            await connection.end()
            return result;
        }
        catch(err){
            console.log(err)
        }
    }

    async updateUser(userInfo){
        try{
            const connection = new pg.Client(this.connectionInfo)
            await connection.connect()
            const result = await connection.query(`update users set password = '${userInfo.password}', email = '${userInfo.email}' where id = '${userInfo.id}'`);
            await connection.end();
            return result;
        }
        catch(err){
            console.log(err)
        }
    }

    async deleteUser(userName){
        try{
            const connection = new pg.Client(this.connectionInfo)
            await connection.connect()
            const result = await connection.query(`delete from users where name = ${userName}`);
            await connection.end()
            return result;
        }
        catch(err){
            console.log(err)
        }
    }
}

const userModel = new UserModel(connectionInfo);

export default userModel;