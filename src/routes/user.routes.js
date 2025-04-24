import { Router } from 'express';
import { getCurrentUserController } from '../controllers/user.controller';
import { ctrlWrapper } from '../utils/ctrlWrapper';
import auth from '../middlewares/auth.middleware';

const userRouter = Router();

userRouter.get('/current', auth, ctrlWrapper(getCurrentUserController));

export default userRouter;
