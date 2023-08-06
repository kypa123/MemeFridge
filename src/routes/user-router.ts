import { Router } from 'express';
import { isLoggedIn, asyncHandler } from '../middlewares/index.ts';
import { userController } from '../controller/index.ts';

const userRouter = Router();

userRouter.get('/', asyncHandler(userController.getUser));

userRouter.post('/', asyncHandler(userController.addUser));

userRouter.delete('/', asyncHandler(userController.deleteUser));

userRouter.get(
    '/auth',
    isLoggedIn,
    asyncHandler(userController.getLoggedInUser),
);

userRouter.post('/auth', asyncHandler(userController.login));

userRouter.post('/logout', asyncHandler(userController.logout));

export default userRouter;
