import * as pg from 'pg';

export default class NonMemberContentModel {
    private connectionInfo: string;
    private pool: pg.Pool;
    constructor(connectionInfo: string) {
        this.connectionInfo = connectionInfo;
        this.pool = new pg.Pool({ connectionString: this.connectionInfo });
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
