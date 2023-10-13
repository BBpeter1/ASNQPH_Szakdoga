import express from 'express';
import { BookController } from './controller/book.controller';
import { UserController } from './controller/user.controller';
import { CategoryController } from './controller/category.controller';
import { checkUser } from './protect-routes';

export function getRoutes() {
    const router = express.Router();

    const bookController = new BookController();
    router.get('/books', bookController.getAll);
    router.post('/books', checkUser, bookController.create);
    router.put('/books', checkUser, bookController.update);
    router.get('/books/available', bookController.getAvailableBooks);
    router.get('/books/borrowed', bookController.getBorrowedBooks);
    router.get('/books/sold', bookController.getSoldBooks);
    router.post('/books/borrow', checkUser, bookController.borrowBook);
    router.post('/books/sell', checkUser, bookController.sellBook);
    router.post('/books/return',checkUser, bookController.returnBook);
    router.get('/books/overdue', bookController.getOverdueBooks);
    router.get('/books/:id', bookController.getOne);
    router.delete('/books/:id', checkUser, bookController.delete);

    const userController = new UserController();
    router.get('/users',checkUser, userController.getAll);
    router.get('/users/:id',checkUser, userController.getOne);
    router.post('/users',checkUser, userController.create);
    router.put('/users', checkUser,checkUser, userController.update);
    router.delete('/users/:id',checkUser, checkUser, userController.delete);
    router.post('/users/login', userController.login);

    const categoryController = new CategoryController();
    router.get('/categories', checkUser,categoryController.getAll);
    router.get('/categories/:id',checkUser, categoryController.getOne);
    router.post('/categories', checkUser, categoryController.create);
    router.put('/categories', checkUser, categoryController.update);
    router.delete('/categories/:id', checkUser, categoryController.delete);

    return router;
}
