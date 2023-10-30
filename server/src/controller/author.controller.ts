import { AppDataSource } from "../data-source"
import { Author } from "../entity/Author"
import { Controller } from "./base.controller"

export class AuthorController extends Controller
{
    repository = AppDataSource.getRepository(Author);
}