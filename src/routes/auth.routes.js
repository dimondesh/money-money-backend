import express from 'express';
import {ctrlWrapper} from '../utils/ctrlWrapper.js';

import { registerController, loginController, logoutController } from '../controllers/auth.controller.js';

const router = express.Router();
const jsonParser = express.json();

router.post("/register", jsonParser, ctrlWrapper(registerController));
router.post("/login", jsonParser, ctrlWrapper(loginController));
router.post("/logout", jsonParser, ctrlWrapper(logoutController));

export default router;