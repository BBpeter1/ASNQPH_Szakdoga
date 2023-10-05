import { AppDataSource } from "../data-source";
import { Book } from "../entity/Book";
import { Controller } from "./base.controller";

export class BookController extends Controller {
    repository = AppDataSource.getRepository(Book);
}