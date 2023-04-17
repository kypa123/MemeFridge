import { contentModel } from '../db/index.js'
import { createClient } from 'redis';

class ContentService{
    constructor(contentModel, createClient){
        this.contentModel = contentModel;
        this.createClient = createClient
    }

    async addContent(contentInfo){
        // const {name, desc, url} = contentInfo
        // 중복제거를 위한 로직 필요, 이미 존재하는 컨텐츠명 등
        const result = await this.contentModel.addContent(contentInfo);
        return result

    }

    async findByOffset(offset){
        const result = await this.contentModel.findByOffset(offset*4);
        return result;
    }

    async findByContentId(id){
        const result = await this.contentModel.findByContentId(id);
        return result;
    }

    async updateContent(contentInfo){
        const result = await this.contentModel.updateContent(contentInfo);
        return result;
    }

    async deleteContent(contentInfo){
        const result = await this.contentModel.deleteContent(contentInfo);
        return result;
    }
    async updateCacheRankData(){
        try{
            const rankData = await this.contentModel.getRankContents();
            const client = this.createClient();
            await client.connect();
            let rank = 1;
            rankData.forEach(data=>{
                client.set(`rank${rank}`,JSON.stringify(data))
                rank++;
            })
            return;
        }
        catch(err){
            console.log(err)
        }
    }

    async getCacheRankData(){
        try{
            const client = this.createClient();
            await client.connect();
            let result = []
            for(let i = 1; i<5; i++){;
                result.push({rank: i, ...JSON.parse(await client.get(`rank${i}`))})
            }
            return result;
        }catch(err){
            console.log(err)
        }
    }
}


const contentService = new ContentService(contentModel, createClient);

export default contentService;