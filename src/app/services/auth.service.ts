import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private TOKEN_KEY = 'accessToken';
  private IS_ADMIN_KEY = 'isAdmin';

  constructor(private router: Router) { }

  setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setIsAdmin(isAdmin: boolean) {
    localStorage.setItem(this.IS_ADMIN_KEY, String(isAdmin));
  }

  isAdmin(): boolean {
    return localStorage.getItem(this.IS_ADMIN_KEY) == 'true';
  }

  removeToken() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  preventGuestAccess(): boolean {
    const isLoggedIn = this.isLoggedIn();

    if (!isLoggedIn) {
        this.router.navigateByUrl('/login');
    }

    return isLoggedIn;
  }

  onlyAdminAccess(): boolean {
    if (!this.isAdmin()) {
      this.router.navigateByUrl('/login');
    }

    return this.isAdmin();
  }
}