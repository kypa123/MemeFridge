import UserModel from '../../src/db/models/user-model.ts';
import { Pool } from 'pg';

jest.mock('pg');

const mockUserData = {
    command: 'SELECT',
    rowCount: 4,
    oid: null,
    rows: [
        {
            id: 1,
            name: '첫번째',
            password: '첫번째비번',
            email: 'first@gmail.com',
        },
        {
            id: 2,
            name: '두번째',
            password: '두번째비번',
            email: 'second@gmail.com',
        },
        {
            id: 3,
            name: '세번째',
            password: '세번째비번',
            email: 'third@gmail.com',
        },
        {
            id: 4,
            name: '네번째',
            password: '네번째비번',
            email: 'fourth@gmail.com',
        },
    ],
};

it('userModelPoolQuery', async () => {
    const mockPool: jest.Mocked<Pool> = {
        query: jest.fn().mockResolvedValue(mockUserData.rows),
        totalCount: 0,
        idleCount: 0,
        waitingCount: 0,
        connect: jest.fn(),
        end: jest.fn(),
        on: jest.fn(),
        addListener: jest.fn(),
        once: jest.fn(),
        removeListener: jest.fn(),
        off: jest.fn(),
        removeAllListeners: jest.fn(),
        setMaxListeners: jest.fn(),
        getMaxListeners: jest.fn(),
        listeners: jest.fn(),
        rawListeners: jest.fn(),
        emit: jest.fn(),
        listenerCount: jest.fn(),
        prependListener: jest.fn(),
        prependOnceListener: jest.fn(),
        eventNames: jest.fn(),
    };
    const testModel: UserModel = new UserModel(mockPool);
    const result = await testModel.findUser({
        name: 'charlie',
        email: 'crl@gmail.com',
    });
    expect(result).toEqual(mockUserData.rows);
});
