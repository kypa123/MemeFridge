import request from 'supertest';
import app from '../test-environment/app.ts';

//contentRouter, controller test
describe('GET /contents', () => {
    it('offset을 통해 4개의 데이터를 가져온다', async () => {
        const response = await request(app).get('/contents?offset=2');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('rowCount');
        expect(response.body.rowCount).toEqual(4);
    });
    it('데이터 개수를 넘어서는 offset이라면, rowCount가 0으로 반환된다', async () => {
        const response = await request(app).get('/contents?offset=9999');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('rowCount');
        expect(response.body.rowCount).toEqual(0);
    });
});

describe('GET /contents/rank/zzal', () => {
    it('가장 높은 조회수의 컨텐츠 4개가 배열에 담겨 반환된다', done => {
        request(app)
            .get('/contents/rank/zzal')
            .expect(200)
            .expect(res => {
                expect(res.body).toHaveLength(4);
                expect(Array.isArray(res.body)).toBe(true);
            })
            .end(done);
    });
});

describe('GET /contents/rank/tags', () => {
    it('공백을 기준으로 여러개의 태그를 담은 string을 반환한다', done => {
        request(app)
            .get('/contents/rank/tags')
            .expect(200)
            .expect(res => {
                expect(typeof res.body).toBe('string');
            })
            .end(done);
    });
});
describe('GET /contents/id', () => {
    it('존재하지 않는 컨텐츠 아이디라면, 에러를 반환한다', done => {
        request(app)
            .get('/contents/id?id=2')
            .expect(500)
            .expect(res => {
                expect(res.text).toContain(
                    '에러가 발생했습니다. 코드 : undefined',
                );
            })
            .end(done);
    });
    it('올바른 컨텐츠 아이디라면, 짤 컨텐츠를 반환한다', done => {
        request(app)
            .get('/contents/id?id=6')
            .expect(200)
            .expect(res => {
                expect(res.body).toHaveProperty('id');
                expect(res.body).toHaveProperty('creator');
                expect(res.body).toHaveProperty('title');
                expect(res.body).toHaveProperty('tags');
                expect(res.body).toHaveProperty('count');
                expect(res.body).toHaveProperty('url');
                expect(res.body).toHaveProperty('created_at');
            })
            .end(done);
    });
});
describe('GET /contents/user', () => {
    it('존재하지 않는 아이디라면, 메세지와 404에러를 반환한다', done => {
        request(app).get('/contents/user?user=asdf').expect(404).expect(
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
            .get('/contents/user?user=testuser')
            .expect(200)
            .expect(res => {
                expect(res.body).toHaveProperty('rowCount');
                expect(res.body).toHaveProperty('rows');
            })
            .end(done);
    });
});
describe('GET /contents/tags', () => {
    it('검색결과가 있다면, 결과를 담은 쿼리 결과문을 반환한다', done => {
        request(app)
            .get(encodeURI('/contents/tags?tags=동물'))
            .expect(200)
            .expect(res => {
                expect(res.body).toHaveProperty('rowCount');
                expect(res.body.rowCount > 0).toBe(true);
                expect(res.body).toHaveProperty('rows');
            })
            .end(done);
    });
    it('검색결과가 없다면, 빈 결과를 담은 쿼리 결과문을 반환한다', done => {
        request(app)
            .get('/contents/tags?tags=1234')
            .expect(200)
            .expect(res => {
                expect(res.body).toHaveProperty('rowCount');
                expect(res.body.rowCount > 0).toBe(false);
                expect(res.body).toHaveProperty('rows');
            })
            .end(done);
    });
});
