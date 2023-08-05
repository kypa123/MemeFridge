import pg from 'pg';

export default class NonMemberContentModel {
    private pool: pg.Pool;
    constructor(pool: pg.Pool) {
        this.pool = pool;
    }

    async addNonMemberContent(nonMemberContentInfo: {
        contentId: number;
        auth: string;
    }) {
        try {
            const result = await this.pool.query(
                `insert into non_member_contents (content_id, id_pwd) values (${nonMemberContentInfo.contentId},'${nonMemberContentInfo.auth}') returning id;`,
            );

            return result;
        } catch (err) {
            return err;
        }
    }

    async deleteNonMemberContent(contentId: number) {
        try {
            const result = await this.pool.query(
                `delete from non_member_contents where content_id = ${contentId};`,
            );

            return result;
        } catch (err) {
            return err;
        }
    }
}
