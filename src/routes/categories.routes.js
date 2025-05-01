import { Router } from 'express';
import auth from '../middlewares/auth.middleware.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { getCategoriesController } from '../controllers/categories.controller.js';

const categoriesRouter = Router();

categoriesRouter.get('/', ctrlWrapper(getCategoriesController));

export default categoriesRouter;
