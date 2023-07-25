import pg from 'pg';
import connectionInfo from '../connectionInfo.js';

class UserModel {
    private connectionInfo: string;
    constructor(connectionInfo: string) {
        this.connectionInfo = connectionInfo;
    }

    async findUser(userInfo: { name: string; email: string }) {
        try {
            const name = userInfo.name || 'no name';
            const email = userInfo.email || 'no email';

            const connection = new pg.Client(this.connectionInfo);
            await connection.connect();
            const result = await connection.query(
                `select * from users where name='${name}' or email='${email}'`,
            );
            await connection.end();
            return result;
        } catch (err) {
            return err;
        }
    }

    async addUser(userInfo: {
        name: string;
        hashedPassword: string;
        email: string;
    }) {
        try {
            const connection = new pg.Client(this.connectionInfo);
            await connection.connect();
            const result = await connection.query(
                `insert into users (name, password,email) values ('${userInfo.name}','${userInfo.hashedPassword}','${userInfo.email}') returning id;`,
            );
            await connection.end();
            return result;
        } catch (err) {
            console.log(err);
        }
    }

    async updateUser(userInfo: {
        password: string;
        email: string;
        id: string;
    }) {
        try {
            const connection = new pg.Client(this.connectionInfo);
            await connection.connect();
            const result = await connection.query(
                `update users set password = '${userInfo.password}', email = '${userInfo.email}' where id = '${userInfo.id}'`,
            );
            await connection.end();
            return result;
        } catch (err) {
            console.log(err);
        }
    }

    async deleteUser(userName: string) {
        try {
            const connection = new pg.Client(this.connectionInfo);
            await connection.connect();
            const result = await connection.query(
                `delete from users where name = ${userName}`,
            );
            await connection.end();
            return result;
        } catch (err) {
            console.log(err);
        }
    }
}

const userModelInstance = new UserModel(connectionInfo);

export { userModelInstance, UserModel };
