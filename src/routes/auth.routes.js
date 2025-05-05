import express from 'express';
import {ctrlWrapper} from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { loginUserSchema, registerUserSchema } from '../validation/auth.js';


import { registerController, loginController, logoutController, refreshController } from '../controllers/auth.controller.js';

const router = express.Router();
const jsonParser = express.json();

router.post("/register", jsonParser,validateBody(registerUserSchema), ctrlWrapper(registerController));
router.post("/login", jsonParser, validateBody(loginUserSchema),ctrlWrapper(loginController));
router.post("/logout", jsonParser, ctrlWrapper(logoutController));
router.post("/refresh", ctrlWrapper(refreshController));

export default router;