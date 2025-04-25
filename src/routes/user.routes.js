import { Router } from 'express';
import { getCurrentUserController } from '../controllers/user.controller.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import auth from '../middlewares/auth.middleware.js';

const userRouter = Router();

userRouter.get('/current', auth, ctrlWrapper(getCurrentUserController));

export default userRouter;
