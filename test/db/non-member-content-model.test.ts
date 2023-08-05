import NonMemberContentModel from '../../src/db/models/non-member-content-model.ts';
import { Pool } from 'pg';

jest.mock('pg');

const mockNonMemberContentData = {
    command: 'SELECT',
    rowCount: 4,
    oid: null,
    rows: [
        {
            id: 1,
            creator: 2,
            name: '첫번째',
            description: '첫번째설명',
            tags: '첫번째태그1 첫번째태그2',
            created_at: '2023-07-28T12:12:55.710Z',
        },
        {
            id: 2,
            creator: 2,
            name: '두번째',
            description: '두번째설명',
            tags: '두번째태그1 두번째태그2',
            created_at: '2023-07-28T12:12:55.718Z',
        },
        {
            id: 3,
            creator: 2,
            name: '세번째',
            description: '세번째 설명',
            tags: '세번째태그1 세번째태그2',
            created_at: '2023-07-28T12:12:55.762Z',
        },
        {
            id: 4,
            creator: 2,
            name: '네번째',
            description: '네번째 설명',
            tags: '네번째태그1 네번째태그2',
            created_at: '2023-07-28T12:12:55.764Z',
        },
    ],
};

it('nonMemberContentModelPoolQuery', async () => {
    (Pool as jest.MockedClass<typeof Pool>).mockImplementation(() => mockPool);
    const mockPool: jest.Mocked<Pool> = {
        query: jest.fn().mockResolvedValue(mockNonMemberContentData.rows),
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
    const testModel = new NonMemberContentModel(mockPool);
    const result = await testModel.addNonMemberContent({
        contentId: 1234,
        auth: 'random',
    });
    expect(result).toEqual(mockNonMemberContentData.rows);
});
