import pg from 'pg';
import connectionInfo from '../connectionInfo.js';

class ContentModel {
    private connectionInfo: string;
    constructor(connectionInfo: string) {
        this.connectionInfo = connectionInfo;
    }

    async findAll() {
        try {
            const connection = new pg.Client(this.connectionInfo);
            await connection.connect();
            const result = await connection.query(
                'select c.id, c.creator, z.title, t.tags, zc.count, zu.url, c.created_at from contents c ' +
                    'left join zzals z on c.id = z.content_id ' +
                    'left join tags t on c.id = t.content_id ' +
                    'left join zzals_url zu on z.title = zu.title ' +
                    'left join zzals_count zc on z.title = zc.title;',
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
                'select c.id, c.creator, z.title, t.tags, zc.count, zu.url, c.created_at from contents c ' +
                    'left join zzals z on c.id = z.content_id ' +
                    'left join tags t on c.id = t.content_id ' +
                    'left join zzals_url zu on z.title = zu.title ' +
                    'left join zzals_count zc on z.title = zc.title ' +
                    `order by c.id limit 4 offset ${offset};`,
            );
            await connection.end();
            return result;
        } catch (err) {
            return err;
        }
    }

    async updateByContentId(contentId: number) {
        try {
            const connection = new pg.Client(this.connectionInfo);
            await connection.connect();
            const result = await connection.query(
                'update zzals_count ' +
                    'set count = count + 1 ' +
                    `where title = (select title from zzals' + where content_id = ${contentId});`,
            );
            await connection.end();
            return result;
        } catch (err) {
            return err;
        }
    }
    async findByContentId(contentId: number) {
        try {
            const connection = new pg.Client(this.connectionInfo);
            await connection.connect();
            const result = await connection.query(
                'select c.id, c.creator, z.title, t.tags, zc.count, zu.url, c.created_at from contents c ' +
                    'left join zzals z on c.id = z.content_id ' +
                    'left join tags t on c.id = t.content_id ' +
                    'left join zzals_url zu on z.title = zu.title ' +
                    'left join zzals_count zc on z.title = zc.title ' +
                    `where id = ${contentId}`,
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
                'select c.id, c.creator, z.title, t.tags, zc.count, zu.url, c.created_at from contents c ' +
                    'left join zzals z on c.id = z.content_id ' +
                    'left join tags t on c.id = t.content_id ' +
                    'left join zzals_url zu on z.title = zu.title ' +
                    'left join zzals_count zc on z.title = zc.title ' +
                    `where c.creator = ${userId};`,
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
            let query =
                'select c.id, c.creator, z.title, t.tags, zc.count, zu.url, c.created_at from contents c ' +
                'left join zzals z on c.id = z.content_id ' +
                'left join tags t on c.id = t.content_id ' +
                'left join zzals_url zu on z.title = zu.title ' +
                'left join zzals_count zc on z.title = zc.title where ';
            const string = tags.reduce(
                (acc, curr) => acc + 't.tags like ' + "'%" + curr + "%' and ",
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

    async addContent(contentInfo: {
        name: string;
        tag: string;
        uploaderId: number;
        url: string;
        login: boolean;
    }) {
        try {
            const { name, tag, uploaderId, url, login } = contentInfo;
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
            'select c.id, c.creator, z.title, t.tags, zc.count, zu.url, c.created_at from contents c ' +
                'left join zzals z on c.id = z.content_id ' +
                'left join tags t on c.id = t.content_id ' +
                'left join zzals_url zu on z.title = zu.title ' +
                'left join zzals_count zc on z.title = zc.title ' +
                `order by zc.count desc limit 4;`,
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

const contentModelInstance = new ContentModel(connectionInfo);

export { contentModelInstance, ContentModel };
