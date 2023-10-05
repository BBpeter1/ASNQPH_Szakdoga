import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Book } from "../entity/Book";

export abstract class Controller {
    repository: Repository<any>;

    getAll = async (req, res) => {
        try {
            const entities = await this.repository.find();
            res.json(entities);
        } catch (err) {
            this.handleError(res, err);
        }
    };

    getOne = async (req, res) => {
        try {
            const id = req.params.id;
            const entity = await this.repository.findOneBy({ id: id });
            if (!entity) {
                return this.handleError(res, null, 404, 'Not found.');
            }

            res.json(entity);
        } catch (err) {
            this.handleError(res, err);
        }
    };

    create = async (req, res) => {
        try {
            const entity = this.repository.create(req.body as object);
            entity.id = null;

            const result = await this.repository.save(entity);

            res.json(result);
        } catch (err) {
            this.handleError(res, err);
        }
    };

    update = async (req, res) => {
        try {
            const entity = this.repository.create(req.body as object);
            const entityToUpdate = await this.repository.findOneBy({ id: entity.id });
            if (!entityToUpdate) {
                return this.handleError(res, null, 404, 'Not found.');
            }

            const result = await this.repository.save(entity);
            res.json(result);
        } catch (err) {
            this.handleError(res, err);
        }
    };

    delete = async (req, res) => {
        try {
            const entityToDelete = await this.repository.findOneBy({
                id: req.params.id
            });

            if (!entityToDelete) {
                return this.handleError(res, null, 404, 'Not found.');
            }

            await this.repository.remove(entityToDelete);
            res.status(200).send();
        } catch (err) {
            this.handleError(res, err);
        }
    };

    handleError(res, err = null, status = 500, message = 'Unexpected server error') {
        if (err) {
            console.error(err);
        }

        res.status(status);
        res.json({ error: message });
    }

    getAvailableBooks = async (req, res) => {
        try {
            const books = await this.repository.find({ where: { status: 'szabad' } });
            res.json(books);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving available books' });
        }
    };

    borrowBook = async (req, res) => {
        try {

            const { bookId } = req.body;

            const user = await this.repository.findOneBy({ id: req.auth.id });
            const book = await this.repository.findOneBy({ id: bookId });

        
            if (!user || !book) {
                return res.status(404).json({ message: 'User or book not found' });
            }

            user.borrowedBooks = await AppDataSource.getRepository(Book).findBy({ borrower: { id: req.auth.id } })

            if (user.borrowedBooks.length >= 6) {
                return res.status(400).json({ message: 'User has reached the maximum limit of borrowed books' });
            }

            book.status = 'kölcsönzött';
            book.borrowDate = new Date();

            user.borrowedBooks.push(book);

            await this.repository.save(user);
            await this.repository.save(book);

            res.json({ message: 'Book borrowed successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error borrowing book' });
        }
    };

    returnBook = async (req, res) => {
        try {
            const { userId, bookId } = req.body;

            const user = await this.repository.findOne(userId);
            const book = await this.repository.findOne(bookId);

            if (!user || !book) {
                return res.status(404).json({ message: 'User or book not found' });
            }
            user.borrowedBooks = user.borrowedBooks.filter(borrowedBook => borrowedBook.id !== book.id);

            book.status = 'szabad';
            book.borrowDate = null;

            await this.repository.save(user);
            await this.repository.save(book);

            res.json({ message: 'Book returned successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error returning book' });
        }
    };

    getOverdueBooks = async (req, res) => {
        try {
            const overdueDays = 30;

            const overdueBooks = await this.repository
                .createQueryBuilder('book')
                .leftJoinAndSelect('book.borrower', 'user')
                .where('book.status = :status', { status: 'kölcsönözve' })
                .andWhere('book.borrowDate <= :dueDate', {
                    dueDate: new Date(new Date().getTime() - overdueDays * 24 * 60 * 60 * 1000).toISOString(),
                })
                .getMany();

            overdueBooks.forEach((book) => {
                const borrowDate = new Date(book.borrowDate);
                const currentDate = new Date();
                const delay = Math.floor((currentDate.getTime() - borrowDate.getTime()) / (24 * 60 * 60 * 1000));
                book.delay = delay;
            });

            res.json({ overdueBooks });
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving overdue books' });
        }
    };

}