import { Component, OnInit, TemplateRef } from '@angular/core';
import { BookDTO } from 'models';
import { BookService } from '../services/book.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


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
  searchTermFree: string = '';
  searchTermBorrowed: string = '';
  userId: number = 0;
  bookId: number = 0;
  selectedStartDate: string = '';
  selectedEndDate: string = '';
  selectedAuthor: string = '';
  selectedCategory: string = '';
  selectedStartDateFree: string = '';
  selectedEndDateFree: string = '';
  selectedAuthorFree: string = '';
  selectedCategoryFree: string = '';
  selectedStartDateBorrowed: string = '';
  selectedEndDateBorrowed: string = '';
  selectedAuthorBorrowed: string = '';
  selectedCategoryBorrowed: string = '';
  uniqueCategories: string[] = [];
  uniqueAuthors: string[] = [];
  uniqueCategoriesFree: string[] = [];
  uniqueAuthorsFree: string[] = [];
  uniqueCategoriesBorrowed: string[] = [];
  uniqueAuthorsBorrowed: string[] = [];

  constructor(private bookService: BookService,
    private toastr: ToastrService,
    private router: Router,
    public authService: AuthService,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute) {
    this.loadData();

  }
  ngOnInit(): void {

    this.loadData();
    this.loadAvailableBooks();
    this.loadBorrowedBooks();
    this.filterTable();
    this.filterTableBorrowed();
    this.filterTableFree();
    this.getUniqueCategories();
    this.getUniqueAuthors();
    this.getUniqueCategoriesFree();
    this.getUniqueAuthorsFree();
    this.getUniqueCategoriesBorrowed();
    this.getUniqueAuthorsBorrowed();
    this.bookService.getAll().subscribe(
      {
        next: (books) => { this.books = books },
        error: (err) => { this.toastr.error('Hiba',err) },
      }
    );
  }

  navigateToProductForm(id: number) {
    this.router.navigate(['/product-form', id]);
  }

  loadData(): void {
    this.bookService.getAll().subscribe(
      (books) => {
        this.books = books;
        this.loadAvailableBooks();
        this.loadBorrowedBooks();
        this.searchBooksBorrowed();
        this.searchBooksFree();
        this.searchBooks();
        this.filterTable();
        this.filterTableFree();
        this.filterTableBorrowed();
        this.getUniqueCategories();
        this.getUniqueAuthors();
        this.getUniqueCategoriesFree();
        this.getUniqueAuthorsFree();
        this.getUniqueCategoriesBorrowed();
        this.getUniqueAuthorsBorrowed();
      },
      (error) => {
        this.toastrService.error('Hiba', error);
      }
    );
  }

  deleteBook(book: BookDTO) {
    if (book.status !== 'szabad') {
      this.toastrService.error('A tétel nem törölhető, mert kölcsönzött vagy eladott!', 'Hiba');
      return; 
    }
  
    this.bookService.delete(book.id).subscribe({
      next: () => {
        const index = this.books.indexOf(book);
        if (index > -1) {
          this.books.splice(index, 1);
          window.location.reload();
        }
      },
      error: (err) => {
        this.toastrService.error('Hiba a tétel törlésekor', 'Hiba');
      }
    });
  }


  searchBooks() {

    if (this.searchTerm.toLowerCase().trim()) {
      this.filteredBooks = this.books.filter(
        book => book.title.toLowerCase().includes(this.searchTerm) || book.Author.toLowerCase().includes(this.searchTerm) || book.description.toLowerCase().includes(this.searchTerm)
      ).sort((a, b) => a.title.localeCompare(b.title));
    }
    else {
      this.filteredBooks = this.books.slice();
    }
  }

  searchBooksFree() {

    if (this.searchTermFree.toLowerCase().trim()) {
      this.availableBooks = this.availableBooks.filter(
        book => book.title.toLowerCase().includes(this.searchTermFree) || book.Author.toLowerCase().includes(this.searchTermFree) || book.description.toLowerCase().includes(this.searchTermFree)
      ).sort((a, b) => a.title.localeCompare(b.title));
    }
    else {
      this.loadAvailableBooks();
    }
  }

  searchBooksBorrowed() {

    if (this.searchTermBorrowed.toLowerCase().trim()) {

      this.borrowedBooks = this.borrowedBooks.filter(
        book => book.title.toLowerCase().includes(this.searchTermBorrowed) || book.Author.toLowerCase().includes(this.searchTermBorrowed) || book.description.toLowerCase().includes(this.searchTermBorrowed)
      ).sort((a, b) => a.title.localeCompare(b.title));
    }
    else {
      this.loadBorrowedBooks();
    }
  }

  loadAvailableBooks() {
    this.bookService.getAvailableBooks().subscribe(
      (books: BookDTO[]) => {
        this.availableBooks = books;
      },
      (error) => {
        this.toastr.error('Hiba a betöltéskor!', error);
      }
    );
  }

  loadBorrowedBooks() {
    this.bookService.getBorrowedBooks().subscribe(
      (books: BookDTO[]) => {
        this.borrowedBooks = books;
      },
      (error) => {
        this.toastr.error('Hiba a betöltéskor!', error);
      }
    );
  }

  borrowBook(userId: number, bookId: number) {
    this.bookService.borrowBook(userId, bookId).subscribe(
      () => {
        this.toastr.success('Sikeresen kikölcsönözted a tételt!'),
          this.loadBorrowedBooks();
          this.loadAvailableBooks();
      },
      (error) => {
        this.toastr.error('Hiba a kölcsönzéskor!', error);
      }
    );

  }

  sellBook(userId: number, bookId: number) {
    this.bookService.sellBook(userId, bookId).subscribe(
      () => {
         this.toastr.success('Sikeresen megvetted a tételt!'),
          this.loadAvailableBooks();
      },
      (error) => {
        this.toastr.error('Hiba a vételkor!', error);
      }
    );
  }

  returnBook(userId: number, bookId: number) {
    this.bookService.returnBook(userId, bookId).subscribe(
      () => {
        this.toastr.success('Sikeresen visszaszolgáltattad a tételt!'),
          this.loadAvailableBooks();
          this.loadBorrowedBooks();
      },
      (error) => {
       console.log(error);
        this.toastr.error('Hiba a visszahozáskor!', error);
      }
    );
  }

  filterTable() {
    this.filteredBooks = this.books.filter((book) => {
      const matchesFirstSelector = this.selectedAuthor === '' || book.Author === this.selectedAuthor;
      const matchesCategory = this.selectedCategory === '' || book.category === this.selectedCategory;

      const startDate = this.selectedStartDate ? new Date(this.selectedStartDate) : null;
      const endDate = this.selectedEndDate ? new Date(this.selectedEndDate) : null;
      const itemDate = new Date(book.date);
      const isDateInRange =
        (!startDate || itemDate >= startDate) &&
        (!endDate || itemDate <= endDate);

      return matchesFirstSelector && matchesCategory && isDateInRange;
    });

    if (!this.selectedAuthor && !this.selectedCategory && !this.selectedStartDate && !this.selectedEndDate) {
      this.filteredBooks = this.books;
    }
  }

  filterTableFree() {
    this.availableBooks = this.availableBooks.filter((book) => {
      const matchesFirstSelector = this.selectedAuthorFree === '' || book.Author === this.selectedAuthorFree;
      const matchesCategory = this.selectedCategoryFree === '' || book.category === this.selectedCategoryFree;

      const startDate = this.selectedStartDateFree ? new Date(this.selectedStartDateFree) : null;
      const endDate = this.selectedEndDateFree ? new Date(this.selectedEndDateFree) : null;
      const itemDate = new Date(book.date);
      const isDateInRange =
        (!startDate || itemDate >= startDate) &&
        (!endDate || itemDate <= endDate);

      return matchesFirstSelector && matchesCategory && isDateInRange;
    });

    if (!this.selectedAuthorFree && !this.selectedCategoryFree && !this.selectedStartDateFree && !this.selectedEndDateFree) {
      this.getUniqueAuthorsFree();
      this.getUniqueCategoriesFree();
      this.loadAvailableBooks();
    }
  }

  filterTableBorrowed() {
    this.borrowedBooks = this.borrowedBooks.filter((book) => {
      const matchesFirstSelector = this.selectedAuthorBorrowed === '' || book.Author === this.selectedAuthorBorrowed;
      const matchesCategory = this.selectedCategoryBorrowed === '' || book.category === this.selectedCategoryBorrowed;

      const startDate = this.selectedStartDateBorrowed ? new Date(this.selectedStartDateBorrowed) : null;
      const endDate = this.selectedEndDateBorrowed ? new Date(this.selectedEndDateBorrowed) : null;
      const itemDate = new Date(book.date);
      const isDateInRange =
        (!startDate || itemDate >= startDate) &&
        (!endDate || itemDate <= endDate);

      return matchesFirstSelector && matchesCategory && isDateInRange;
    });

    if (!this.selectedAuthorBorrowed && !this.selectedCategoryBorrowed && !this.selectedStartDateBorrowed && !this.selectedEndDateBorrowed) {
      this.getUniqueAuthorsBorrowed();
      this.getUniqueCategoriesFree();
      this.loadBorrowedBooks();
    }
  }

  getUniqueCategories(): void {
    this.uniqueCategories = Array.from(new Set(this.books.map(book => book.category)));
  }

  getUniqueAuthors(): void {
    this.uniqueAuthors = Array.from(new Set(this.books.map(book => book.Author)));
  }

  getUniqueCategoriesFree(): void {
    this.uniqueCategoriesFree = Array.from(new Set(this.availableBooks.map(book => book.category)));
  }

  getUniqueAuthorsFree(): void {
    this.uniqueAuthorsFree = Array.from(new Set(this.availableBooks.map(book => book.Author)));
  }

  getUniqueCategoriesBorrowed(): void {
    this.loadBorrowedBooks();
    this.uniqueCategoriesBorrowed = Array.from(new Set(this.borrowedBooks.map(book => book.category)));
  }

  getUniqueAuthorsBorrowed(): void {
    this.loadBorrowedBooks();
    this.uniqueAuthorsBorrowed = Array.from(new Set(this.borrowedBooks.map(book => book.Author)));
  }

  open(content: TemplateRef<any>, bookId: number, action: string) {
    let bookToDelete: BookDTO | undefined;

    for (const book of this.books) {
      if (book.id === bookId) {
        bookToDelete = book;
        break;
      }
    }

    if (!bookToDelete) {
      this.toastrService.error('Tétel nem található a megadott ID-vel:', bookId);
      return;
    }

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        if (action === 'buy') {
          if (result === 'confirm') {
            this.sellBook(this.userId, bookId);
          }
        } else if (action === 'borrow') {
          if (result === 'confirm') {
            this.borrowBook(this.userId, bookId);
          }
        }
        else if (action === 'delete') {
          if (result === 'confirm') {
            if (bookToDelete) {
              this.deleteBook(bookToDelete);
            } else {
              this.toastrService.error('Tétel nem található a megadott ID-vel:', bookId);
            }
          }
        }
        else if (action === 'return') {
          if (result === 'confirm') {
            this.returnBook(this.userId, bookId);
          } else {
            this.toastrService.error('Tétel nem található a megadott ID-vel:', bookId);
          }
        }
      },
      (reason) => {
        console.error('Modal dismissed with reason: ', reason);
      }
    );
  }

}