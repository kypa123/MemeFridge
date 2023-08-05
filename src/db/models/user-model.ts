import pg from 'pg';

export default class UserModel {
    private pool: pg.Pool;
    constructor(pool: pg.Pool) {
        this.pool = pool;
    }

    async findUser(userInfo: { name: string; email: string }) {
        try {
            const name = userInfo.name || 'no name';
            const email = userInfo.email || 'no email';

            const result = await this.pool.query(
                `select * from users where name='${name}' or email='${email}'`,
            );

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
            const result = await this.pool.query(
                `insert into users (name, password,email) values ('${userInfo.name}','${userInfo.hashedPassword}','${userInfo.email}') returning id;`,
            );

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
            const result = await this.pool.query(
                `update users set password = '${userInfo.password}', email = '${userInfo.email}' where id = '${userInfo.id}'`,
            );

            return result;
        } catch (err) {
            console.log(err);
        }
    }

    async deleteUser(userName: string) {
        try {
            const result = await this.pool.query(
                `delete from users where name = ${userName}`,
            );

            return result;
        } catch (err) {
            console.log(err);
        }
    }
}
