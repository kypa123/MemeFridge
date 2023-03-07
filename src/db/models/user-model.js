import pg from 'pg';


class UserModel{
    constructor(connection){
        this.connection = new pg.Client(connection);
    }
    
    async findUser(id){
        try{
            await this.connection.connect()
            const result = await this.connection.query(`select * from users where id=${id}`);
            await this.connection.end()
            return result
        }
        catch(err){
            return err
        }
    }

    async addUser(userInfo){
        try{
            await this.connection.connect();
            const result = await this.connection.query(`insert into users (name, password,email) values ('${userInfo.id}','${userInfo.password}','${userInfo.email}');`);
            await this.connectind.end()
            return result;
        }
        catch(err){
            console.log(err)
        }
    }

    async updateUser(userInfo){
        try{
            await this.connection.connect();
            const result = await this.connection.query(`update users set password = '${userInfo.password}', email = '${userInfo.email}' where id = '${userInfo.id}'`);
            await this.connection.end();
            return result;
        }
        catch(err){
            console.log(err)
        }
    }

    async deleteUser(userId){
        try{
            await this.connection.connect();
            const result = await this.connection.query(`delete from users where id = ${userId}`);
            await this.connectind.end()
            return result;
        }
        catch(err){
            console.log(err)
        }
    }

}

const userModel = new UserModel({
    user: process.env.DB_ID,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

export default userModel;