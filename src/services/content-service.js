import { contentModel } from '../db/index.js'

class ContentService{
    constructor(contentModel){
        this.contentModel = contentModel;
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

    async findById(id){
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
}


const contentService = new ContentService(contentModel);

export default contentService;