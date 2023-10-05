import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BookDTO } from 'models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  deleteProduct(id: number) {
    throw new Error('Method not implemented.');
  }

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<BookDTO[]>('/api/books/');
  }

  getOne(id: number) {
    return this.http.get<BookDTO>('/api/books/' + id);
  }

  create(book: BookDTO){
    return this.http.post<BookDTO>('/api/books', book);
  }

  update(book: BookDTO) {
    return this.http.put<BookDTO>('/api/books/', book);
  }

  delete(id: number) {
    return this.http.delete<BookDTO>('/api/books/' + id);
  }

  getAvailableBooks(): Observable<BookDTO[]> {
    return this.http.get<BookDTO[]>('/api/books/available');
  }

  borrowBook(userId: number, bookId: number): Observable<any> {
    return this.http.post('api/books/borrow', { userId, bookId });
  }

  returnBook(userId: number, bookId: number): Observable<any> {
    return this.http.post('api/books/return', { userId, bookId });
  }

  getOverdueBooks(): Observable<any> {
    return this.http.get('api/books/overdue');
  }

}
