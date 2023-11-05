import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BookService } from '../services/book.service';
import { AuthService } from '../services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { BookDTO } from 'models';

@Component({
  selector: 'app-user-product',
  templateUrl: './user-product.component.html',
  styleUrls: ['./user-product.component.css']
})
export class UserProductComponent implements OnInit {

  books: BookDTO[] = [];
  userBooks: BookDTO[] = [];
  toastrService: any;
  searchTerm: string = '';

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
    this.bookService.getAll().subscribe(
      {
        next: (books) => { this.books = books },
        error: (err) => { this.toastr.error('Hiba',err) },
      }
    );
  }

  loadData(): void {
    this.bookService.getAll().subscribe(
      (books) => {
        this.loadUserBooks();
        this.books = books;
      },
      (error) => {
        this.toastrService.error('Hiba', error);
      }
    );
  }

  searchBooks() {
    if (this.searchTerm.toLowerCase().trim()) {
      this.userBooks = this.userBooks.filter(
        book => book.title.toLowerCase().includes(this.searchTerm) || book.Author.toLowerCase().includes(this.searchTerm) || book.description.toLowerCase().includes(this.searchTerm)
      ).sort((a, b) => a.title.localeCompare(b.title));
    }
    else {
      this.userBooks = this.userBooks.slice();
    }
  }

  loadUserBooks() {
    this.bookService.getUserBooks().subscribe(
      (books: BookDTO[]) => {
        this.userBooks = books;
      },
      (error) => {
        this.toastr.error('Hiba a betöltéskor!', error);
      }
    );
  }

}
