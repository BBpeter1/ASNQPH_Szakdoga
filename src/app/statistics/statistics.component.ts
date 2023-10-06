import { Component, OnInit } from '@angular/core';
import { BookDTO } from 'models';
import { BookService } from '../services/book.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  books: BookDTO[] = [];
  soldBooks: BookDTO[] = [];
  borrowedBooks: BookDTO[] = [];
  soldBooksCount: number = 0;
  borrowedBooksCount: number = 0;

  constructor(private bookService: BookService,
    private toastr: ToastrService,
    private router: Router,
    public authService: AuthService,
    private activatedRoute: ActivatedRoute) {
    }

  ngOnInit(): void {
    this.loadSoldBooks();
    this.loadBorrowedBooks();
    this.bookService.getAll().subscribe(
      {
        next: (books) => {this.books = books},
        error: (err) => {this.toastr.error('Hiba')},
      }
    );
  }

  loadSoldBooks() {
    this.bookService.getSoldBooks().subscribe(
      (books: BookDTO[]) => {
        this.soldBooks = books;
        this.soldBooksCount = this.soldBooks.length;
      },
      (error) => {
        console.log('Error retrieving sold books:', error);
      }
    );
  }

  loadBorrowedBooks() {
    this.bookService.getBorrowedBooks().subscribe(
      (books: BookDTO[]) => {
        this.borrowedBooks = books;
        this.borrowedBooksCount = this.borrowedBooks.length;
      },
      (error) => {
        console.log('Error retrieving borrowed books:', error);
      }
    );
  }

}
