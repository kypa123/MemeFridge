import { BuzzwordModel } from '../db/index.ts';
import * as configFile from '../config/index.ts';
import * as API from '../utils/api.ts';

export default class BuzzwordService {
    private buzzwordModel: BuzzwordModel;
    private createClient: Function;
    constructor(buzzwordModel: BuzzwordModel, createClient: Function) {
        this.buzzwordModel = buzzwordModel;
        this.createClient = createClient;
    }

    async addBuzzword(buzzwordInfo: {
        name: string;
        tag: string;
        uploaderId: number;
        descr: string;
    }) {
        const result = await this.buzzwordModel.addBuzzword(buzzwordInfo);
        return result;
    }

    async getFromDataAPI(lastBuzzwordId: number) {
        const result = await API.get(
            configFile.default.dataAPI,
            `buzzword?idx=${lastBuzzwordId}`,
        );
        return result;
    }

    async addDatasFromAPI() {
        try {
            const latestId = await this.buzzwordModel.getLatestBuzzwordId();
            let datas = await this.getFromDataAPI(latestId[0].id);
            if (!datas.length) {
                await this.requestUpdateToDataAPI();
                datas = await this.getFromDataAPI(latestId[0].id);
            }
            await datas.forEach(res => {
                const [id, name, descr, tags, creator, created_at] = res;
                if (creator == 'chatGPT') {
                    this.addBuzzword({
                        name,
                        tag: tags,
                        uploaderId: 2,
                        descr,
                    });
                } else if (creator == 'Bard') {
                    this.addBuzzword({
                        name,
                        tag: tags,
                        uploaderId: 3,
                        descr,
                    });
                }
                this.buzzwordModel.setLatestBuzzwordId(id);
            });
        } catch (err) {
            console.log(err);
        }
        return;
    }

    async requestUpdateToDataAPI() {
        const result = await API.post(`${configFile.default.dataAPI}/buzzword`);
        return result;
    }
    async findByOffset(offset: number) {
        const result = await this.buzzwordModel.findByOffset(offset * 4);
        return result;
    }

    async findByBuzzwordId(id: number) {
        const result = await this.buzzwordModel.findByContentId(id);
        return result;
    }

    async findByTags(tags: string[]) {
        const result = await this.buzzwordModel.findByTags(tags);
        return result;
    }

    async findByUserId(userId: number) {
        const result = await this.buzzwordModel.findByUserId(userId);
        return result;
    }

    async deleteBuzzword(BuzzwordId: number) {
        const result = await this.buzzwordModel.deleteBuzzword(BuzzwordId);
        return result;
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
                return;
            }
        } catch (err) {
            console.log(err);
        }
    }
}
