import { Router, Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import CreateCategoryService from '../services/CreateCategoryService';
import CategoriesRepository from '../repositories/CategoriesRepository';

// import TransactionsRepository from '../repositories/TransactionsRepository';
// import CreateTransactionService from '../services/CreateTransactionService';
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const categoriesRouter = Router();

categoriesRouter.get('/', async (request, response) => {
  const categoriesRepository = getCustomRepository(CategoriesRepository);
  const categories = await categoriesRepository.find();
  return response.status(200).json(categories);
});

categoriesRouter.post('/', async (request: Request, response: Response) => {
  const { title } = request.body;
  const createCategoryService = new CreateCategoryService();
  const category = await createCategoryService.execute({ title });
  return response.status(200).json(category);
});

export default categoriesRouter;
