import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import connectBusboy from 'connect-busboy';
import userRouter from '../../src/routes/user-router.ts';
import contentRouter from '../../src/routes/content-router.ts';
import buzzwordRouter from '../../src/routes/buzzword-router.ts';
import upload from '../../src/middlewares/image-upload.ts';
import errorHandler from '../../src/middlewares/errorHandler.ts';
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(connectBusboy());

app.use('/users', userRouter);
app.use('/contents', contentRouter);
app.use('/buzzwords', buzzwordRouter);
app.use(errorHandler);
// userRouter, controller test
describe('GET /users', () => {
    it('이름으로 유저 가져오기', done => {
        request(app)
            .get('/users?name=testuser')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(
                {
                    status: 'success',
                    statusCode: 200,
                    res: [
                        {
                            id: 23,
                            name: 'testuser',
                            password: 'testpwd',
                            email: 'testemail@gg.com',
                        },
                    ],
                },
                done,
            );
    });
    it('이메일로 유저 가져오기', done => {
        request(app)
            .get('/users?email=testemail@gg.com')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(
                {
                    status: 'success',
                    statusCode: 200,
                    res: [
                        {
                            id: 23,
                            name: 'testuser',
                            password: 'testpwd',
                            email: 'testemail@gg.com',
                        },
                    ],
                },
                done,
            );
    });
});

describe('POST /users/auth', () => {
    it('잘못된 이메일을 입력 시 에러를 반환한다', done => {
        request(app)
            .post('/users/auth')
            .send({ email: 'noemail', password: 'testpassword' })
            .expect(404)
            .expect({
                status: 'error',
                message: '해당하는 아이디가 존재하지 않습니다!',
            })
            .end(done);
    });
    it('잘못된 패스워드를 입력 시 에러를 반환한다', done => {
        request(app)
            .post('/users/auth')
            .send({ email: 'testemail@gg.com', password: 'wrongpassword' })
            .expect(404)
            .expect({
                status: 'error',
                message: '패스워드가 옳지 않습니다!',
            })
            .end(done);
    });
    it('로그인이 완료되면, 쿠키에 토큰을 담아 세팅한다', async () => {
        const response = await request(app)
            .post('/users/auth')
            .send({ email: 'testemail@gg.com', password: 'testpwd' })
            .expect(200)
            .expect(res => {
                expect(res.body).toHaveProperty('status');
                expect(res.body).toHaveProperty('body');
            });
        const cookie = response.header['set-cookie'][0];
        expect(response.header['set-cookie']).toBeDefined();
        expect(cookie).toEqual(expect.stringContaining('token='));
        expect(cookie).toEqual(expect.stringContaining('HttpOnly'));
    });
});

describe('GET /users/auth', () => {
    const agent = request.agent(app);
    beforeEach(done => {
        agent
            .post('/users/auth')
            .send({
                email: 'testemail@gg.com',
                password: 'testpwd',
            })
            .end(done);
    });
    it('로그인이 안되어있다면, 에러메세지를 반환한다', done => {
        request(app).get('/users/auth').expect(403).expect(
            {
                status: 'error',
                statusCode: 403,
                message: '로그인되어 있지 않습니다!',
            },
            done,
        );
    });
    it('로그인이 되어있다면, 해당 로그인정보를 가져온다', done => {
        agent.get('/users/auth').expect(200).expect(
            {
                id: 23,
                name: 'testuser',
                password: 'testpwd',
                email: 'testemail@gg.com',
            },
            done,
        );
    });
});

describe('POST /users', () => {
    it('중복된 이름이라면 메세지를 반환한다', done => {
        request(app)
            .post('/users')
            .send({
                name: 'testuser',
                email: 'randomEmail@ggg.com',
                password: 'randomPassword',
            })
            .expect({ message: '이미 존재하는 아이디입니다.' }, done);
    });
    it('중복된 이메일이라면 메세지를 반환한다', done => {
        request(app)
            .post('/users')
            .send({
                name: 'randomuser',
                email: 'testemail@gg.com',
                password: 'randomPassword',
            })
            .expect({ message: '이미 존재하는 이메일입니다.' }, done);
    });

    it('올바른 입력이라면, 회원가입 후 아이디 담은 객체를 반환한다.', async () => {
        const res = await request(app)
            .post('/users')
            .send({
                name: 'randomuser',
                email: 'randomemail@gg.com',
                password: 'randomPassword',
            })
            .expect(200);
        const row = res.body.rows[0];
        expect(row).toHaveProperty('id');
        expect(Number.isInteger(row.id)).toBe(true);
    });
});

describe('DELETE /users', () => {
    it('아이디를 삭제한다', done => {
        request(app)
            .delete('/users?name=randomuser')
            .expect(200)
            .expect({ status: 200, message: 'ok' }, done);
    });
});

describe('POST /users/logout', () => {
    it('쿠키에 저장된 token값을 삭제한다', async () => {
        const response = await request(app).post('/users/logout');
        const clearCookieSpy = jest.spyOn(response.res, 'clearCookie');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'ok' });
        expect(clearCookieSpy).toHaveBeenCalledWith('token');
    });
});

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
    it('존재하지 않는 아이디라면, 에러를 반환한다', done => {
        request(app)
            .get('/contents/user?user=asdf')
            .expect(500)
            .expect(res => {
                expect(res.text).toContain(
                    '에러가 발생했습니다. 코드 : undefined',
                );
            })
            .end(done);
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

// describe('POST /contents', () => {
//     //업로드 함수 모킹
//     const spyField = jest
//         .spyOn(upload.prototype, 'on')
//         .mockImplementation((event, callback: any) => {
//             if (event === 'file') {
//                 const testFile = { pipe: jest.fn() }; // 모킹된 pipe 함수
//                 callback('fieldname', testFile, {});
//             }
//         });
//     it('이미지를 업로드하고 값을 반환한다', done => {
//         request(app)
//             .post('/contents')
//             .field('name', 'testname')
//             .field('tag', 'testTag')
//             .field('uploaderName', 'testuser')
//             .field('uploaderPassword', 'testpwd')
//             .expect(200)
//             .expect(res => {
//                 console.log('res:', res);
//             })
//             .end(done);
//     });
// });
// describe('DELETE /contents', () => {});

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
    it('존재하지 않는 아이디라면, rowCount가 0인 결과를 반환한다', done => {
        request(app)
            .get('/buzzwords/user?user=asdf')
            .expect(200)
            .expect(res => {
                expect(res.body).toHaveProperty('rowCount');
                expect(res.body.rowCount).toEqual(0);
            })
            .end(done);
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
// describe('POST /buzzwords/dataAPI', () => {});
// describe('POST /buzzwords', () => {});
// describe('DELETE /buzzwords', () => {});
