import pg from 'pg';
import connectionInfo from '../connectionInfo.js';

//모델만들고 서비스만들고 비회원 << 이거추가해야되니까 데이터베이스에 컬럼 추가

class BuzzwordModel {
    private connectionInfo: string;
    constructor(connectionInfo: string) {
        this.connectionInfo = connectionInfo;
    }

    async findAll() {
        try {
            const connection = new pg.Client(this.connectionInfo);
            await connection.connect();
            const result = await connection.query(
                'select b.id, b.name, bc.creator_id as creator, bd.description as descr, bt.tags, b.created_at from buzzwords as b, buzzwords_creator as bc, buzzwords_descr as bd, buzzwords_tags as bt where b.id = bc.buzzword_id and b.id = bd.buzzword_id and b.id = bt.buzzword_id;',
            );
            await connection.end();
            return result;
        } catch (err) {
            return err;
        }
    }

    async findByOffset(offset: number) {
        try {
            const connection = new pg.Client(this.connectionInfo);
            await connection.connect();
            const result = await connection.query(
                `select * from contents order by id limit 4 offset ${offset};`,
            );
            await connection.end();
            return result;
        } catch (err) {
            return err;
        }
    }

    async findByUserId(userId: number) {
        try {
            const connection = new pg.Client(this.connectionInfo);
            await connection.connect();
            const result = await connection.query(
                `select * from contents where creator=${userId}`,
            );
            await connection.end();
            return result;
        } catch (err) {
            return err;
        }
    }

    async findByTags(tags: string[]) {
        try {
            const connection = new pg.Client(this.connectionInfo);
            await connection.connect();
            let query = 'select * from contents where ';
            const string = tags.reduce(
                (acc, curr) => acc + 'tag like ' + "'%" + curr + "%' and ",
                '',
            );
            query += string;
            query = query.slice(0, -5);
            const result = await connection.query(query);
            await connection.end();
            return result;
        } catch (err) {
            return err;
        }
    }

    async addBuzzword(buzzwordInfo: {
        name: string;
        tag: string;
        uploaderId: number;
        login: boolean;
    }) {
        try {
            const { name, tag, uploaderId, login } = buzzwordInfo;
            const connection = new pg.Client(this.connectionInfo);
            await connection.connect();
            const result = await connection.query(
                `insert into contents (title, creator, url, tag, login) values ('${name}', ${uploaderId}, '${url}', '${tag}', '${login}') returning id;`,
            );
            await connection.end();
            return result;
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    async getRankContents() {
        const connection = new pg.Client(this.connectionInfo);
        await connection.connect();
        const result = await connection.query(
            `select * from contents order by count desc limit 4;`,
        );
        await connection.end();
        return result.rows;
    }

    async deleteContent(contentId: number) {
        const connection = new pg.Client(this.connectionInfo);
        await connection.connect();
        const result = await connection.query(
            `delete from contents where id=${contentId}`,
        );
        await connection.end();
        return result.rows;
    }
}

const buzzwordModelInstance = new BuzzwordModel(connectionInfo);

export { buzzwordModelInstance, BuzzwordModel };
