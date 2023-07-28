import { Router } from 'express';
import { asyncHandler } from '../middlewares/index.ts';
import { buzzwordController } from '../controller/index.ts';

const buzzwordRouter = Router();

buzzwordRouter.post(
    '/dataAPI',
    asyncHandler(buzzwordController.getBuzzwordsFromDataAPI),
);

buzzwordRouter.get('/id', asyncHandler(buzzwordController.getBuzzwordsById));

buzzwordRouter.get(
    '/user',
    asyncHandler(buzzwordController.getBuzzwordsByUserId),
);

buzzwordRouter.get('tags', asyncHandler(buzzwordController.getBuzzwordsByTags));

buzzwordRouter.post('/', asyncHandler(buzzwordController.addBuzzword));

buzzwordRouter.post(
    '/dataAPI',
    asyncHandler(buzzwordController.getBuzzwordsFromDataAPI),
);

buzzwordRouter.delete('/', asyncHandler(buzzwordController.deleteBuzzword));

export default buzzwordRouter;
