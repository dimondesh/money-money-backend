import express from 'express';
import { login } from '../controllers/auth.controller.js';
import {
  registerUserController,
  loginUserController,
  logoutUserController,
} from '../controllers/auth.controller.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerUserSchema, loginUserSchema } from '../schemas/userSchemas.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const authRouter = express.Router();

authRouter.post('/login', login);


router.post(
  '/sign-up',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

router.post(
  '/sign-in',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

router.post('/sign-out', ctrlWrapper(logoutUserController));

export default router;

export default authRouter;

