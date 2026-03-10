import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'isLoggedIn';

  constructor() {}

  login(username: string, password: string): boolean {
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem(this.TOKEN_KEY, 'true');
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return localStorage.getItem(this.TOKEN_KEY) === 'true';
  }
}
