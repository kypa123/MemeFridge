import request from 'supertest';
import app from '../test-environment/app.ts';

//buzzwordRouter, Controller test

describe('GET /buzzwords', () => {
    it('offset을 통해 4개의 유행어 데이터를 가져온다', done => {
        request(app)
            .get('/buzzwords?offset=2')
            .expect(response => {
                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('rowCount');
                expect(response.body.rowCount).toEqual(4);
            })
            .end(done);
    });
});
describe('GET /buzzwords/id', () => {
    it('존재하지 않는 id라면, rowCount가 0인채로 반환된다', done => {
        request(app)
            .get('/buzzwords/id?id=2')
            .expect(200)
            .expect(res => {
                expect(res.body).toHaveProperty('rowCount');
                expect(res.body.rowCount).toEqual(0);
            })
            .end(done);
    });
    it('존재하는 id라면, 해당 데이터를 반환한다', done => {
        request(app)
            .get('/buzzwords/id?id=108')
            .expect(200)
            .expect(res => {
                expect(res.body).toHaveProperty('rowCount');
                expect(res.body);
                expect(res.body.rowCount > 0).toBe(true);
                const data = res.body.rows[0];
                expect(data).toHaveProperty('id');
                expect(data).toHaveProperty('creator');
                expect(data).toHaveProperty('name');
                expect(data).toHaveProperty('description');
                expect(data).toHaveProperty('tags');
            })
            .end(done);
    });
});
describe('GET /buzzwords/user', () => {
    it('존재하지 않는 아이디라면, 메세지와 함께 404 에러를 반환한다', done => {
        request(app).get('/buzzwords/user?user=asdf').expect(404).expect(
            {
                status: 'error',
                statusCode: 404,
                message: '해당 유저는 존재하지 않습니다',
            },
            done,
        );
    });

    it('존재하는 아이디라면, 쿼리 결과문을 반환한다', done => {
        request(app)
            .get('/buzzwords/user?user=chatGPT')
            .expect(200)
            .expect(res => {
                expect(res.body).toHaveProperty('rowCount');
                expect(res.body.rowCount > 0).toBe(true);
                const data = res.body.rows[0];
                expect(data).toHaveProperty('id');
                expect(data).toHaveProperty('creator');
                expect(data).toHaveProperty('name');
                expect(data).toHaveProperty('description');
                expect(data).toHaveProperty('tags');
            })
            .end(done);
    });
});
describe('GET /buzzwords/tags', () => {
    it('공백을 기준으로 여러개의 태그를 입력하고, 결과값을 반환한다', done => {
        request(app)
            .get('/buzzwords/tags?tags=testtag')
            .expect(200)
            .expect(res => {
                expect(res.body).toHaveProperty('rowCount');
                expect(res.body.rowCount > 0).toBe(true);
                const data = res.body.rows[0];
                expect(data).toHaveProperty('id');
                expect(data).toHaveProperty('creator');
                expect(data).toHaveProperty('name');
                expect(data).toHaveProperty('description');
                expect(data).toHaveProperty('tags');
            })
            .end(done);
    });
});
