import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccessTokenDTO, BookDTO, LoginDTO, UserDTO } from 'models';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: UserDTO[] = [];

  deleteUser(id: number) {
    throw new Error('Method not implemented.');
  }

  constructor(private http: HttpClient) {
  }

  getAll() {
    return this.http.get<UserDTO[]>('/api/users/');
  }

  getOne(id: number) {
    return this.http.get<UserDTO>('/api/users/' + id);
  }

  create(user: UserDTO) {
    return this.http.post<UserDTO>('/api/users/', user);
  }

  update(user: UserDTO) {
    return this.http.put<UserDTO>('/api/users/', user);
  }

  delete(user: UserDTO) {
    return this.http.put<UserDTO>('/api/users/', user);
  }

  login(data: LoginDTO) {
    return this.http.post<AccessTokenDTO>('/api/users/login', data);
  }

}
