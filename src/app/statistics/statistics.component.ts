import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { BookDTO } from 'models';
import { BookService } from '../services/book.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import * as XLSX from 'xlsx';


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
  XlsFileName: string='';
  JsonFileName: string='';
  selectedStartDate: string = '';
  selectedEndDate: string = '';
  @ViewChild('contentToConvert', { static: false }) contentToConvert!: ElementRef;


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
      this.toastr.error('Az elem nem található az oldalon!');
    }
  }

  exportToXLSX() {
    var data = document.getElementById('contentToConvert');
    if(data)
    {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Statisztika');
    XLSX.writeFile(wb, `${this.XlsFileName}.xlsx`);

  } else {
    this.toastr.error('Az elem nem található az oldalon!');
  }
    
  }

  exportToJSON() {
    const jsonData = JSON.stringify(this.books);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
  
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.JsonFileName}.json`;
    document.body.appendChild(a);
  
    a.click();
  
    window.URL.revokeObjectURL(url);
  }

  loadSoldBooks() {
    this.bookService.getSoldBooks().subscribe(
      (books: BookDTO[]) => {
        this.soldBooks = books;
        this.soldBooksCount = this.soldBooks.length;
        this.soldBooksSum = this.soldBooks.reduce((total, book) => total + book.price, 0);
      },
      (error) => {
        this.toastr.error('Hiba a betöltéskor!',error);
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
        this.toastr.error('Hiba a betöltéskor!',error);
      }
    );
  }

  filterTable() {
    this.borrowedBooks = this.books.filter((book) => {
      const startDate = this.selectedStartDate ? new Date(this.selectedStartDate) : null;
      const endDate = this.selectedEndDate ? new Date(this.selectedEndDate) : null;
      const itemDate = new Date(book.borrowDate);
      const itemDate2 = new Date(book.soldDate);
      const isDateInRange = (!startDate || itemDate >= startDate) && (!startDate || itemDate2 >= startDate) && (!endDate || itemDate2 <= endDate) &&
        (!endDate || itemDate <= endDate);

      return isDateInRange;
    });

    this.soldBooks = this.books.filter((book) => {
      const startDate = this.selectedStartDate ? new Date(this.selectedStartDate) : null;
      const endDate = this.selectedEndDate ? new Date(this.selectedEndDate) : null;
      const itemDate = new Date(book.borrowDate);
      const itemDate2 = new Date(book.soldDate);
      const isDateInRange = (!startDate || itemDate >= startDate) && (!startDate || itemDate2 >= startDate) && (!endDate || itemDate2 <= endDate) &&
        (!endDate || itemDate <= endDate);

      return isDateInRange;
    });

    if ( !this.selectedStartDate && !this.selectedEndDate) {
      this.borrowedBooks, this.soldBooks = this.books;
    }
  }

}
