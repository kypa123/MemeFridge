import pg from 'pg';
import connectionInfo from '../connectionInfo.ts';

export default class BuzzwordModel {
    private connectionInfo: string;
    private pool: pg.Pool;
    constructor(connectionInfo: string) {
        this.connectionInfo = connectionInfo;
        this.pool = new pg.Pool({ connectionString: this.connectionInfo });
    }

    async findAll() {
        try {
            const result = await this.pool.query(
                'select c.id, c.creator, b.name, bd.description, t.tags, c.created_at ' +
                    'from buzzwords b ' +
                    'left join contents c on c.id = b.content_id ' +
                    'left join tags t on c.id = t.content_id ' +
                    'left join buzzwords_desc bd on bd.buzzword_id = b.id',
            );

            return result;
        } catch (err) {
            return err;
        }
    }

    async findByOffset(offset: number) {
        try {
            const result = await this.pool.query(
                'select c.id, c.creator, b.name, bd.description, t.tags, c.created_at ' +
                    'from buzzwords b ' +
                    'left join contents c on c.id = b.content_id ' +
                    'left join tags t on c.id = t.content_id ' +
                    'left join buzzwords_desc bd on bd.buzzword_id = b.id ' +
                    `order by c.id limit 4 offset ${offset};`,
            );

            return result;
        } catch (err) {
            return err;
        }
    }

    async findByContentId(contentId: number) {
        try {
            const result = await this.pool.query(
                'select c.id, c.creator, b.name, bd.description, t.tags, c.created_at ' +
                    'from buzzwords b ' +
                    'left join contents c on c.id = b.content_id ' +
                    'left join tags t on c.id = t.content_id ' +
                    'left join buzzwords_desc bd on bd.buzzword_id = b.id ' +
                    `where c.id = ${contentId}`,
            );

            return result;
        } catch (err) {
            return err;
        }
    }

    async findByUserId(userId: number) {
        try {
            const result = await this.pool.query(
                'select c.id, c.creator, b.name, bd.description, t.tags, c.created_at ' +
                    'from buzzwords b ' +
                    'left join contents c on c.id = b.content_id ' +
                    'left join tags t on c.id = t.content_id ' +
                    'left join buzzwords_desc bd on bd.buzzword_id = b.id ' +
                    `where c.creator = ${userId};`,
            );

            return result;
        } catch (err) {
            return err;
        }
    }

    async findByTags(tags: string[]) {
        try {
            let query =
                'select c.id, c.creator, b.name, bd.description, t.tags, c.created_at ' +
                'from buzzwords b ' +
                'left join contents c on c.id = b.content_id ' +
                'left join tags t on c.id = t.content_id ' +
                'left join buzzwords_desc bd on bd.buzzword_id = b.id where ';
            const string = tags.reduce(
                (acc, curr) => acc + 't.tags like ' + "'%" + curr + "%' and ",
                '',
            );
            query += string;
            query = query.slice(0, -5);
            const result = await this.pool.query(query);

            return result;
        } catch (err) {
            return err;
        }
    }

    async addBuzzword(buzzwordInfo: {
        name: string;
        tag: string;
        uploaderId: number;
        descr: string;
    }) {
        try {
            const { name, tag, descr, uploaderId } = buzzwordInfo;
            console.log(
                'name:',
                name,
                'tag:',
                tag,
                'descr:',
                descr,
                'uploaderId:',
                uploaderId,
            );

            const query = `with contentins as ( insert into contents (creator) values (${uploaderId}) returning id ), 
            buzzwordsins as ( insert into buzzwords(name, content_id) select '${name}', id from contentins returning id), 
            tagsins as ( insert into tags (content_id, tags) select id, '${tag}' from contentins ), 
            buzzwordsdescins as ( insert into buzzwords_desc (buzzword_id, description) select id, '${descr}' from buzzwordsins ) 
            select id from contentins;
            `;

            const result = await this.pool.query(query);

            return result;
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    async deleteBuzzword(buzzwordId: number) {
        const result = await this.pool.query(
            `delete from contents where id=${buzzwordId}`,
        );

        return result.rows;
    }

    async getLatestBuzzwordId() {
        const result = await this.pool.query('select * from latest_buzzword');

        return result.rows;
    }

    async setLatestBuzzwordId(latestId: number) {
        const result = await this.pool.query(
            `update latest_buzzword set id=${latestId}`,
        );

        return;
    }
}
