import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoryDTO } from 'models';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  deleteCategory(id: number) {
    throw new Error('Method not implemented.');
  }

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<CategoryDTO[]>('/api/categories/');
  }

  getOne(id: number) {
    return this.http.get<CategoryDTO>('/api/categories/' + id);
  }

  create(category: CategoryDTO){
    return this.http.post<CategoryDTO>('/api/categories/', category);
  }

  update(category: CategoryDTO) {
    return this.http.put<CategoryDTO>('/api/categories/', category);
  }

  delete(id: number) {
    return this.http.delete('/api/categories/' + id);
  }

}
