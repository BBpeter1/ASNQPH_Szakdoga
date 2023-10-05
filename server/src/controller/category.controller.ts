import { AppDataSource } from "../data-source"
import { Category } from "../entity/Category"
import { Controller } from "./base.controller"

export class CategoryController extends Controller
{
    repository = AppDataSource.getRepository(Category);
}