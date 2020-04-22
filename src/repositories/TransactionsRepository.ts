import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(transactions: Transaction[]): Promise<Balance> {
    const totalIncome = transactions
      .filter(transaction => transaction.type === 'income')
      .reduce(
        (total, transaction) => Number(total) + Number(transaction.value),
        0,
      );

    const totalOutcome = transactions
      .filter(transaction => transaction.type === 'outcome')
      .reduce(
        (total, transaction) => Number(total) + Number(transaction.value),
        0,
      );

    const balance: Balance = {
      income: totalIncome,
      outcome: totalOutcome,
      total: totalIncome - totalOutcome,
    };

    return balance;
  }
}

export default TransactionsRepository;
