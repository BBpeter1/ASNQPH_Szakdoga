import express from 'express';
import { BookController } from './controller/book.controller';
import { UserController } from './controller/user.controller';
import { AuthorController} from './controller/author.controller';
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
    router.post('/users', userController.create);
    router.put('/users', checkUser,userController.update);
    router.post('/users/:id',checkUser, userController.deactivate);
    router.post('/users/login', userController.login);

    const authorController = new AuthorController();
    router.get('/authors', checkUser,authorController.getAll);
    router.get('/authors/:id',checkUser, authorController.getOne);
    router.post('/authors', checkUser, authorController.create);
    router.put('/authors', checkUser, authorController.update);
    router.delete('/authors/:id', checkUser, authorController.delete);

    return router;
}
