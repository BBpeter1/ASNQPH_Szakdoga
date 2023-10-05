import { Component, OnInit } from '@angular/core';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-overdue-books',
  templateUrl: './overdue-books.component.html',
  styleUrls: ['./overdue-books.component.css']
})
export class OverdueBooksComponent implements OnInit {
  
  overdueBooks: any[] = [];

  constructor(private bookService: BookService) { }

  ngOnInit(): void {
    this.getOverdueBooks();
  }

  getOverdueBooks(): void {
    this.bookService.getOverdueBooks()
      .subscribe(
        (response: any) => {
          this.overdueBooks = response.overdueBooks;
        },
        (error) => {
          console.error('Error retrieving overdue books:', error);
        }
      );
  }
}
