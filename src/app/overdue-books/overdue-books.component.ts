import { Component, OnInit } from '@angular/core';
import { BookService } from '../services/book.service';
import { NotificationService } from '../services/notification-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-overdue-books',
  templateUrl: './overdue-books.component.html',
  styleUrls: ['./overdue-books.component.css']
})
export class OverdueBooksComponent implements OnInit {

  overdueBooks: any[] = [];
  books: any[] = [];
  searchTerm: string = '';

  constructor(private bookService: BookService,
    private notificationService: NotificationService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getOverdueBooks();
    this.searchBooks();
  }

  getOverdueBooks(): void {
    this.bookService.getOverdueBooks()
      .subscribe(
        (response: any) => {
          this.overdueBooks = response.overdueBooks;
        },
        (error) => {
          this.toastr.error('Hiba a betöltéskor!',error);
        }
      );
  }

  searchBooks() {
    if (this.searchTerm.toLowerCase().trim()) {
      this.overdueBooks = this.overdueBooks.filter(book => {
        const titleMatch = book.title.toLowerCase().includes(this.searchTerm);
        const borrowerMatch = book.borrower.name.toLowerCase().includes(this.searchTerm);
        return titleMatch || borrowerMatch;
      }).sort((a, b) => a.title.localeCompare(b.title));
    } else {
      this.getOverdueBooks();
    }
  }

  sendEmail(): void {
    this.overdueBooks.forEach((book) => {
        const borrowerEmail = book.borrower.email;
        const message = `Tétel neve: ${book.title} | Tétel kikölcsönzésének dátuma: ${book.borrowDate} | 
        Számított késés: ${book.delay} nap`;
        this.notificationService.sendEmail(borrowerEmail,message).then(
            (response) => {
                this.toastr.success('Email elküldve!');
            },
            (error) => {
                this.toastr.error('Hiba az email elküldése során!',error);
            }
        );
    });
}

}
