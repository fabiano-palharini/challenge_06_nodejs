// import AppError from '../errors/AppError';

import { getCustomRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CategoriesRepository from '../repositories/CategoriesRepository';
import CreateCategoryService from './CreateCategoryService';
import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: 'outcome' | 'income';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getCustomRepository(CategoriesRepository);

    if (type === 'outcome') {
      const balance = await transactionsRepository.getBalance();
      if (balance.total - value < 0) {
        throw new AppError('Insufficient funds', 400);
      }
    }

    let transactionCategory = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (!transactionCategory) {
      const createCategoryService = new CreateCategoryService();
      transactionCategory = await createCategoryService.execute({
        title: category,
      });
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: transactionCategory,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }

  public async saveTransactions(
    transactions: Transaction[],
  ): Promise<Transaction[]> {
    const savedTransactions: Transaction[] = [];

    const dbPromisses = transactions.map(async transaction => {
      const newTransaction = await this.execute({
        title: transaction.title,
        value: transaction.value,
        type: transaction.type,
        category: transaction.category.title,
      });
      savedTransactions.push(newTransaction);
    });

    await Promise.all(dbPromisses);

    return savedTransactions;
  }
}

export default CreateTransactionService;
