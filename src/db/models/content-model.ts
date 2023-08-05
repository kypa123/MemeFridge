import pg from 'pg';

export default class ContentModel {
    private pool: pg.Pool;
    constructor(pool: pg.Pool) {
        this.pool = pool;
    }

    async findAll() {
        try {
            const result = await this.pool.query(
                'select c.id, c.creator, z.title, t.tags, zc.count, zu.url, c.created_at from zzals z ' +
                    'left join contents c on c.id = z.content_id ' +
                    'left join tags t on c.id = t.content_id ' +
                    'left join zzals_url zu on z.title = zu.title ' +
                    'left join zzals_count zc on z.title = zc.title;',
            );
            return result;
        } catch (err) {
            return err;
        }
    }

    async findByOffset(offset: number) {
        try {
            const result = await this.pool.query(
                'select c.id, c.creator, z.title, t.tags, zc.count, zu.url, c.created_at from zzals z ' +
                    'left join contents c on c.id = z.content_id ' +
                    'left join tags t on c.id = t.content_id ' +
                    'left join zzals_url zu on z.title = zu.title ' +
                    'left join zzals_count zc on z.title = zc.title ' +
                    `order by c.id limit 4 offset ${offset};`,
            );
            return result;
        } catch (err) {
            return err;
        }
    }

    async updateByContentId(contentId: number) {
        try {
            const result = await this.pool.query(
                'update zzals_count ' +
                    'set count = count + 1 ' +
                    `where title = (select title from zzals where content_id = ${contentId});`,
            );

            return result;
        } catch (err) {
            return err;
        }
    }
    async findByContentId(contentId: number) {
        try {
            const result = await this.pool.query(
                'select c.id, c.creator, z.title, t.tags, zc.count, zu.url, c.created_at from zzals z ' +
                    'left join contents c on c.id = z.content_id ' +
                    'left join tags t on c.id = t.content_id ' +
                    'left join zzals_url zu on z.title = zu.title ' +
                    'left join zzals_count zc on z.title = zc.title ' +
                    `where id = ${contentId}`,
            );

            return result;
        } catch (err) {
            return err;
        }
    }

    async findByUserId(userId: number) {
        try {
            const result = await this.pool.query(
                'select c.id, c.creator, z.title, t.tags, zc.count, zu.url, c.created_at from zzals z ' +
                    'left join contents c on c.id = z.content_id ' +
                    'left join tags t on c.id = t.content_id ' +
                    'left join zzals_url zu on z.title = zu.title ' +
                    'left join zzals_count zc on z.title = zc.title ' +
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
                'select c.id, c.creator, z.title, t.tags, zc.count, zu.url, c.created_at from zzals z ' +
                'left join contents c on c.id = z.content_id ' +
                'left join tags t on c.id = t.content_id ' +
                'left join zzals_url zu on z.title = zu.title ' +
                'left join zzals_count zc on z.title = zc.title where ';
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

    async addContent(contentInfo: {
        name: string;
        tag: string;
        uploaderId: number;
        url: string;
    }) {
        try {
            const { name, tag, uploaderId, url } = contentInfo;

            const query = `with contentins as ( insert into contents (creator) values (${uploaderId}) returning id ), 
            zzalsins as ( insert into zzals(title, content_id) select '${name}', id from contentins returning title ), 
            tagsins as ( insert into tags (content_id, tags) select id, '${tag}' from contentins ), 
            zzalscountins as ( insert into zzals_count (title, count) select title, 0 from zzalsins ), 
            zzalsurlins as (insert into zzals_url (title, url) select title, '${url}' from zzalsins)
            select id from contentins;
            `;

            const result = await this.pool.query(query);

            return result;
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    async getRankContents() {
        const result = await this.pool.query(
            'select c.id, c.creator, z.title, t.tags, zc.count, zu.url, c.created_at from zzals z ' +
                'left join contents c on c.id = z.content_id ' +
                'left join tags t on c.id = t.content_id ' +
                'left join zzals_url zu on z.title = zu.title ' +
                'left join zzals_count zc on z.title = zc.title ' +
                `order by zc.count desc limit 4;`,
        );

        return result.rows;
    }

    async deleteContent(contentId: number) {
        const result = await this.pool.query(
            `delete from contents where id=${contentId}`,
        );

        return result.rows;
    }
}
