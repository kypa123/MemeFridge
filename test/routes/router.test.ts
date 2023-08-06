import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import connectBusboy from 'connect-busboy';
import userRouter from '../../src/routes/user-router.ts';
import contentRouter from '../../src/routes/content-router.ts';
import buzzwordRouter from '../../src/routes/buzzword-router.ts';
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(connectBusboy());

app.use('/users', userRouter);
app.use('/contents', contentRouter);
app.use('/buzzwords', buzzwordRouter);

//userRouter, controller test
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
        request(app).delete('/users').expect(200).expect({ message: 'ok' });
        done();
    });
});
