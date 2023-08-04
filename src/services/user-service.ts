import { UserModel } from '../db/index.ts';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as configFile from '../config/index.ts';

export default class UserService {
    private userModel: UserModel;
    constructor(userModel: UserModel) {
        this.userModel = userModel;
    }

    async addUser(userInfo: { name: string; email: string; password: string }) {
        try {
            const { name, email, password } = userInfo;
            const result = await this.userModel.findUser({ name, email });

            if (result.rowCount > 0) {
                const user = result.rows[0];
                let message = '';
                if (user.name == name) {
                    message = '이미 존재하는 아이디입니다.';
                } else {
                    message = '이미 존재하는 이메일입니다.';
                }
                return { message };
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                const newUser = await this.userModel.addUser({
                    name,
                    hashedPassword,
                    email,
                });
                return newUser;
            }
        } catch (err) {
            return err;
        }
    }

    async findUser(userName: { name: string; email: string }) {
        try {
            const user = await this.userModel.findUser(userName);
            if (user.rowCount == 0) {
                return {
                    status: 'error',
                    statusCode: 404,
                    message: '해당 유저는 존재하지 않습니다',
                };
            } else {
                return { status: 'success', statusCode: 200, res: user.rows };
            }
        } catch (err) {
            return err;
        }
    }

    async updateUser(userInfo: {
        password: string;
        email: string;
        id: string;
    }) {
        const user = await this.userModel.updateUser(userInfo);
        return user;
    }

    async deleteUser(userId: string) {
        const result = await this.userModel.deleteUser(userId);
        return result;
    }

    async login(userInfo: { email: string; password: string }) {
        try {
            const result = await this.userModel.findUser({
                name: null,
                email: userInfo.email,
            });
            if (result.rowCount > 0) {
                const user = result.rows[0];
                const res = await bcrypt.compare(
                    userInfo.password,
                    user.password,
                );
                if (res) {
                    const secretKey =
                        configFile.default.jwtSecret || 'secret-key';
                    const jwtToken = jwt.sign(
                        {
                            name: user.name,
                            email: user.email,
                        },
                        secretKey,
                        {
                            expiresIn: configFile.default.jwtExpire,
                        },
                    );
                    return { status: 'success', body: jwtToken };
                } else {
                    return {
                        status: 'error',
                        message: '패스워드가 옳지 않습니다!',
                    };
                }
            } else {
                return {
                    status: 'error',
                    message: '해당하는 아이디가 존재하지 않습니다!',
                };
            }
        } catch (err) {
            return err;
        }
    }
}
