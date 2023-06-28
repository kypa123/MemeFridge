import { contentModelInstance, ContentModel } from '../db/index.ts'
import { createClient } from 'redis';

class ContentService{
    private contentModel: ContentModel; 
    private createClient: Function;
    constructor(contentModel:ContentModel, createClient:Function){
        this.contentModel = contentModel;
        this.createClient = createClient
    }

    async addContent(contentInfo:{ name: string; tag: string; uploaderId: number; url: string; login: boolean; }){
        // 중복제거를 위한 로직 필요, 이미 존재하는 컨텐츠명 등
        const result = await this.contentModel.addContent(contentInfo);
        return result
    }

    async findByOffset(offset:number){
        const result = await this.contentModel.findByOffset(offset*4);
        return result;
    }

    async findByContentId(id:number){
        const result = await this.contentModel.findByContentId(id);
        return result;
    }

    async findByTags(tags:string[]){
        const result = await this.contentModel.findByTags(tags);
        return result;
    }

    async findByUserId(userId:number){
        const result = await this.contentModel.findByUserId(userId);
        return result
    }
    
    async deleteContent(contentId:number){
        const result = await this.contentModel.deleteContent(contentId);
        return result;
    }
    async updateCacheRankData(){
        try{
            const rankData = await this.contentModel.getRankContents();
            const client = this.createClient({
                url: process.env.REDIS_CONNECTION
              });
            await client.connect();
            if(client.isOpen){
                let rank = 1;
                rankData.forEach(data=>{
                    client.set(`rank${rank}`,JSON.stringify(data))
                    rank++;
                })
                return;
            }
        }
        catch(err){
            console.log(err)
        }
    }

    async getCacheRankData(){
        try{
            const client = this.createClient({
                url: process.env.REDIS_CONNECTION
              });
            await client.connect();
            if(client.isOpen){
                let result = []
                for(let i = 1; i<5; i++){;
                    result.push({rank: i, ...JSON.parse(await client.get(`rank${i}`))})
                }
                return result;
            }
        }catch(err){
            console.log(err)
        }
    }

}


const contentService = new ContentService(contentModelInstance, createClient);

export default contentService;