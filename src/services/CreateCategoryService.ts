import { getCustomRepository } from 'typeorm';
import Category from '../models/Category';
import CategoriesRepository from '../repositories/CategoriesRepository';

interface Request {
  title: string;
}

class CreateCategoryService {
  public async execute({ title }: Request): Promise<Category> {
    const categoryRepository = getCustomRepository(CategoriesRepository);
    const newCategory = await categoryRepository.create({ title });
    await categoryRepository.save(newCategory);
    return newCategory;
  }
}

export default CreateCategoryService;
