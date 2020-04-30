import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const { totalIncome, totalOutcome } = transactions.reduce(
      (accumulator, transaction) => {
        switch (transaction.type) {
          case 'income':
            accumulator.totalIncome += Number(transaction.value);
            break;
          case 'outcome':
            accumulator.totalOutcome += Number(transaction.value);
            break;
          default:
            break;
        }
        return accumulator;
      },
      {
        totalIncome: 0,
        totalOutcome: 0,
        total: 0,
      },
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
