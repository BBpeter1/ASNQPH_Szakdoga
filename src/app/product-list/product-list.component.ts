import { Component, OnInit } from '@angular/core';
import { BookDTO } from 'models';
import { BookService } from '../services/book.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})


export class BookListComponent implements OnInit {

  books: BookDTO[] = [];
  toastrService: any;
  filteredBooks: BookDTO[] = [];
  filteredBook: BookDTO[] = [];
  availableBooks: BookDTO[] = [];
  borrowedBooks: BookDTO[] = [];
  searchTerm: string = '';
  userId: number = 0;
  selectedStartDate: string = '';
  selectedEndDate: string = '';
  selectedAuthor: string = '';


  constructor(private bookService: BookService,
    private toastr: ToastrService,
    private router: Router,
    public authService: AuthService,
    private activatedRoute: ActivatedRoute) {
      
  }
  ngOnInit(): void {
    this.loadAvailableBooks();
    this.loadBorrowedBooks();
    this.bookService.getAll().subscribe(
      {
        next: (books) => {this.books = books},
        error: (err) => {this.toastr.error('Hiba')},
      }
    );
  }


  navigateToProductForm(id:number) {
    this.router.navigate(['/product-form',id]);
  }

  deleteBook(book: BookDTO) {

    this.bookService.delete(book.id).subscribe({
      next: () =>
      {
        const index = this.books.indexOf(book);
        if(index > -1) {
          this.books.splice(index, 1);
        }
      },
        error: (err) =>{
          console.error(err);
          this.toastrService.error('Hiba a könyv törlésekor', 'Hiba');
        }
    });
  }
  
  searchBooks() {
    
    if(this.searchTerm.toLowerCase().trim())
    this.filteredBooks = this.books.filter(
      book => book.title.toLowerCase().includes(this.searchTerm) || book.Author.toLowerCase().includes(this.searchTerm) || book.description.toLowerCase().includes(this.searchTerm)
    ).sort((a, b) => a.title.localeCompare(b.title));
    else
    {
      this.filteredBooks = this.books.slice();
    }
  }
  
  loadAvailableBooks() {
    this.bookService.getAvailableBooks().subscribe(
      (books: BookDTO[]) => {
        this.availableBooks = books;
      },
      (error) => {
        console.log('Error retrieving available books:', error);
      }
    );
  }

  loadBorrowedBooks() {
    this.bookService.getBorrowedBooks().subscribe(
      (books: BookDTO[]) => {
        this.borrowedBooks = books;
      },
      (error) => {
        console.log('Error retrieving borrowed books:', error);
      }
    );
  }

  borrowBook(userId: number, bookId: number) {
    this.bookService.borrowBook(userId, bookId).subscribe(
      () => {
        console.log('Book borrowed successfully');
        this.loadAvailableBooks();
      },
      (error) => {
        console.log('Error borrowing book:', error);
      }
    );
  }

  sellBook(userId: number, bookId: number) {
    this.bookService.sellBook(userId, bookId).subscribe(
      () => {
        console.log('Book sold successfully');
        this.loadAvailableBooks();
      },
      (error) => {
        console.log('Error solding book:', error);
      }
    );
  }

  returnBook(userId: number, bookId: number) {
    this.bookService.returnBook(userId, bookId).subscribe(
      () => {
        console.log('Book returned successfully');
        this.loadAvailableBooks();
      },
      (error) => {
        console.log('Error returning book:', error);
      }
    );
  }

  filterTable() {
    this.filteredBook = this.books.filter((book) => {
      const matchesFirstSelector = this.selectedAuthor === '' || book.Author === this.selectedAuthor;

      const startDate = this.selectedStartDate ? new Date(this.selectedStartDate) : null;
      const endDate = this.selectedEndDate ? new Date(this.selectedEndDate) : null;
      const itemDate = new Date(book.date);
      const isDateInRange =
        (!startDate || itemDate >= startDate) &&
        (!endDate || itemDate <= endDate);

      return matchesFirstSelector && isDateInRange;
    });

    if (!this.selectedAuthor && !this.selectedStartDate && !this.selectedEndDate) {
      this.filteredBook = this.books;
    }
  }

}
