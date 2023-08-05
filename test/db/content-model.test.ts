import ContentModel from '../../src/db/models/content-model.ts';

import { Pool } from 'pg';

jest.mock('pg');

const mockContentData = {
    command: 'SELECT',
    rowCount: 4,
    oid: null,
    rows: [
        {
            id: 1,
            creator: 2,
            title: '첫번째',
            tags: '첫번째태그1 첫번째태그2',
            count: 2,
            url: '1234.com',
            created_at: '2023-07-28T12:12:55.710Z',
        },
        {
            id: 2,
            creator: 2,
            title: '두번째',
            tags: '두번째태그1 두번째태그2',
            count: 2,
            url: '2222.com',
            created_at: '2023-07-28T12:12:55.710Z',
        },
        {
            id: 3,
            creator: 2,
            title: '세번째',
            tags: '세번째태그1 세번째태그2',
            count: 23,
            url: '3334.com',
            created_at: '2023-07-28T12:12:55.710Z',
        },
        {
            id: 4,
            creator: 2,
            title: '네번째',
            tags: '네번째태그1 네번째태그2',
            count: 55,
            url: '4444.com',
            created_at: '2023-07-28T12:12:55.710Z',
        },
    ],
};

it('ContentModelPoolQuery', async () => {
    (Pool as jest.MockedClass<typeof Pool>).mockImplementation(() => mockPool);
    const mockPool: jest.Mocked<Pool> = {
        query: jest.fn().mockResolvedValue(mockContentData.rows),
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
    const testModel = new ContentModel(mockPool);
    const result = await testModel.findAll();
    expect(result).toEqual(mockContentData.rows);
});
