import { AppDataSource } from "../data-source";
import { Book } from "../entity/Book";
import { User } from "../entity/User";
import { Controller } from "./base.controller";

export class BookController extends Controller {

    repository = AppDataSource.getRepository(Book);
    userRepository = AppDataSource.getRepository(User);

    getAvailableBooks = async (req, res) => {
        try {
            const books = await this.repository.find({ where: { status: 'szabad' } });
            res.json(books);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving available books' });
        }
    };

    getSoldBooks = async (req, res) => {
        try {
            const books = await this.repository.find({ where: { status: 'eladott' } });
            res.json(books);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving sold books' });
        }
    };

    getBorrowedBooks = async (req, res) => {
        try {
            const books = await this.repository.find({ where: { status: 'kölcsönzött' } });
            res.json(books);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving sold books' });
        }
    };

    borrowBook = async (req, res) => {
        try {

            const { bookId } = req.body;

            const user = await this.userRepository.findOneBy({ id: req.auth.id });
            const book = await this.repository.findOneBy({ id: bookId });

        
            if (!user || !book) {
                return res.status(404).json({ message: 'User or book not found' });
            }

            user.borrowedBooks = await AppDataSource.getRepository(Book).findBy({ borrower: { id: req.auth.id } })

            if (user.borrowedBooks.length >= 6) {
                return res.status(400).json({ message: 'User has reached the maximum limit of borrowed books' });
            }

            book.status = 'kölcsönzött';
            book.borrowDate = new Date().toISOString();


            user.borrowedBooks.push(book);

            await this.repository.save(user);
            await this.repository.save(book);

            res.json({ message: 'Book borrowed successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error borrowing book' });
        }
    };

    sellBook = async (req, res) => {
        try {

            const { bookId } = req.body;

            const user = await this.userRepository.findOneBy({ id: req.auth.id });
            const book = await this.repository.findOneBy({ id: bookId });

            if (!user || !book) {
                return res.status(404).json({ message: 'User or book not found' });
            }

            user.soldBooks = await AppDataSource.getRepository(Book).findBy({ sold: { id: req.auth.id } })

            book.status = 'eladott';
            book.soldDate = new Date().toISOString();

            user.soldBooks.push(book);

            await this.repository.save(user);
            await this.repository.save(book);

            res.json({ message: 'Book sold successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error solding book' });
        }
    };

    returnBook = async (req, res) => {
        try {
            const { bookId } = req.body;

            const user = await this.userRepository.findOneBy({id: req.auth.id} );
            const book = await this.repository.findOneBy({id: bookId});

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
                .where('book.status = :status', { status: 'kölcsönzött' })
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