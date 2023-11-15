import express from 'express';
import { BookController } from './controller/book.controller';
import { UserController } from './controller/user.controller';
import { AuthorController} from './controller/author.controller';
import { checkUser, onlyAdmin } from './protect-routes';

export function getRoutes() {
    
    const router = express.Router();

    const bookController = new BookController();
    router.get('/books', bookController.getAll);
    router.post('/books', checkUser, onlyAdmin, bookController.create);
    router.put('/books', checkUser, onlyAdmin, bookController.update);
    router.get('/books/available',checkUser, bookController.getAvailableBooks);
    router.get('/books/borrowed', checkUser, bookController.getBorrowedBooks);
    router.get('/books/userbooks',checkUser , bookController.getUserBooks);
    router.get('/books/sold',  bookController.getSoldBooks);
    router.post('/books/borrow', checkUser, bookController.borrowBook);
    router.post('/books/sell', checkUser, bookController.sellBook);
    router.post('/books/return',checkUser, bookController.returnBook);
    router.get('/books/overdue', checkUser, onlyAdmin, bookController.getOverdueBooks);
    router.get('/books/:id', bookController.getOne);
    router.delete('/books/:id', checkUser, onlyAdmin, bookController.delete);

    const userController = new UserController();
    router.get('/users', checkUser, onlyAdmin, userController.getAll);
    router.get('/users/:id',checkUser, onlyAdmin, userController.getOne);
    router.post('/users', userController.create);
    router.put('/users', checkUser, onlyAdmin,userController.update);
    router.post('/users/login', userController.login);
    router.post('/users/:id',checkUser, onlyAdmin, userController.deactivate);

    const authorController = new AuthorController();
    router.get('/authors', checkUser,authorController.getAll);
    router.get('/authors/:id',checkUser, authorController.getOne);
    router.post('/authors', checkUser, authorController.create);
    router.put('/authors', checkUser, authorController.update);
    router.delete('/authors/:id', checkUser, authorController.delete);

    return router;
}
