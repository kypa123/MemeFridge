import { contentModelInstance, ContentModel } from '../db/index.ts';
import { createClient } from 'redis';
import * as configFile from '../config/index.ts';

class ContentService {
    private contentModel: ContentModel;
    private createClient: Function;
    constructor(contentModel: ContentModel, createClient: Function) {
        this.contentModel = contentModel;
        this.createClient = createClient;
    }

    async addContent(contentInfo: {
        name: string;
        tag: string;
        uploaderId: number;
        url: string;
        login: boolean;
    }) {
        // 중복제거를 위한 로직 필요, 이미 존재하는 컨텐츠명 등
        const result = await this.contentModel.addContent(contentInfo);
        return result;
    }

    async findByOffset(offset: number) {
        const result = await this.contentModel.findByOffset(offset * 4);
        return result;
    }

    async findByContentId(id: number) {
        const result = await this.contentModel.findByContentId(id);
        return result;
    }

    async findByTags(tags: string[]) {
        const result = await this.contentModel.findByTags(tags);
        return result;
    }

    async findByUserId(userId: number) {
        const result = await this.contentModel.findByUserId(userId);
        return result;
    }

    async deleteContent(contentId: number) {
        const result = await this.contentModel.deleteContent(contentId);
        return result;
    }
    async updateCacheRankData() {
        try {
            const rankData = await this.contentModel.getRankContents();
            const client = this.createClient({
                url: configFile.default.redisURL,
            });
            await client.connect();
            if (client.isOpen) {
                let rank = 1;
                rankData.forEach(data => {
                    client.set(`rank${rank}`, JSON.stringify(data));
                    rank++;
                });
                return;
            }
        } catch (err) {
            console.log(err);
        }
    }

    async getCacheRankData() {
        try {
            const client = this.createClient({
                url: configFile.default.redisURL,
            });
            await client.connect();
            if (client.isOpen) {
                let result = [];
                for (let i = 1; i < 5; i++) {
                    result.push({
                        rank: i,
                        ...JSON.parse(await client.get(`rank${i}`)),
                    });
                }
                return result;
            }
        } catch (err) {
            console.log(err);
        }
    }

    async getRecentTagsData() {
        try {
            const client = this.createClient({
                url: configFile.default.redisURL,
            });
            await client.connect();
            if (client.isOpen) return await client.get('recentTags');
        } catch (err) {
            console.log(err);
        }
    }

    async updateRecentTagsData(newTag: string) {
        try {
            console.log('최근태그 newTag:', newTag);
            const client = this.createClient({
                url: configFile.default.redisURL,
            });
            await client.connect();
            if (client.isOpen) {
                const recentTags = (await client.get('recentTags')) || '';
                const recentTagsList = recentTags.split(' ');
                if (!recentTagsList.includes(newTag))
                    recentTagsList.push(newTag);
                if (recentTagsList.length > 20) recentTagsList.shift();
                const newRecentTags = recentTagsList.reduce(
                    (acc: string, cur: string) => `${acc} ${cur}`,
                    '',
                );
                const res = client.set('recentTags', newRecentTags);
                console.log(res);
                return;
            }
        } catch (err) {
            console.log(err);
        }
    }
}

const contentService = new ContentService(contentModelInstance, createClient);

export default contentService;
