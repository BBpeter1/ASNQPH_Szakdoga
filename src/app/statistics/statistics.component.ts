import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { BookDTO } from 'models';
import { BookService } from '../services/book.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';


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
  soldBooksSum: number = 0;
  borrowedBooksCount: number = 0;
  PdfFileName: string='';

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
        next: (books) => { this.books = books },
        error: (err) => { this.toastr.error('Hiba') },
      }
    );
  }

  convetToPDF() {
    var data = document.getElementById('contentToConvert');
    if (data) {
        html2canvas(data).then(canvas => {
          var imgWidth = 208;
          var pageHeight = 295;
          var imgHeight = canvas.height * imgWidth / canvas.width;
          var heightLeft = imgHeight;
    
          const contentDataURL = canvas.toDataURL('image/png')
          let pdf = new jspdf('p', 'mm', 'a4');
          var position = 0;
          pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
          pdf.save(`${this.PdfFileName}.pdf`);
      });
    } else {
      console.log("Az elem nem található az oldalon.");
    }
  }

  loadSoldBooks() {
    this.bookService.getSoldBooks().subscribe(
      (books: BookDTO[]) => {
        this.soldBooks = books;
        this.soldBooksCount = this.soldBooks.length;
        this.soldBooksSum = this.soldBooks.reduce((total, book) => total + book.price, 0);
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
