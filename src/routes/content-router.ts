import { Router } from 'express';
import { upload, asyncHandler } from '../middlewares/index.ts';
import { contentController } from '../controller/index.ts';

const contentRouter = Router();


contentRouter.get('/', asyncHandler(contentController.getContentsByOffset));

contentRouter.get('/rank/zzal', asyncHandler(contentController.getRankData));

contentRouter.get('/rank/tags', asyncHandler(contentController.getRecentTags))

contentRouter.get('/id', asyncHandler(contentController.getContentsById));

contentRouter.get('/user', asyncHandler(contentController.getContentsByUser))

contentRouter.get('/tags', asyncHandler(contentController.getContentsByTags))

contentRouter.post('/', upload, asyncHandler(contentController.addContent));

contentRouter.delete('/', asyncHandler(contentController.deleteContent))



export default contentRouter;