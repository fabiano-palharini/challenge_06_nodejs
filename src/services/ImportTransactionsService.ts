import fs from 'fs';

import csvParse from 'csv-parse';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

class ImportTransactionsService {
  async execute(csvFilePath: string): Promise<Transaction[]> {
    const readCSVStream = fs.createReadStream(csvFilePath);
    const parseStream = csvParse({ from_line: 2, ltrim: true, rtrim: true });

    const parseCSV = readCSVStream.pipe(parseStream);
    const transactions: Transaction[] = [];
    let transaction;
    let category;
    parseCSV.on('data', async line => {
      category = new Category(line[3]);
      transaction = new Transaction(line[0], line[1], line[2], category);

      transactions.push(transaction);
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    console.log(transactions);

    return transactions;
  }
}

export default ImportTransactionsService;
