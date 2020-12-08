import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';

import { environment } from '../../environments/environment';
// http://localhost:3100/api/
const BACKEND_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token;
  isAuth = false;
  authStatusListener = new Subject<boolean>();
  setTimer;
  userId;

  constructor(private http: HttpClient, private router: Router, private _snackbar: MatSnackBar) { }

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  isAuthenticated() {
    return this.isAuth;
  }

  login(email: string, password: string) {
    const loginData: AuthData = {
      email: email,
      password: password
    }
    this.http.post<{ token: string, expiresIn: number, userId: string }>(BACKEND_URL + "login", loginData).subscribe(res => {
      console.log(res);
      this.token = res.token;
      this.userId = res.userId;

      if (this.token) {
        // localStorage.setItem('token', res.token);
        this.setTimer = setTimeout(() => {
          this.logout();
        }, res.expiresIn * 1000);

        this.isAuth = true;
        this.authStatusListener.next(true);

        const now = new Date();
        const expirationDate = new Date(now.getTime() + res.expiresIn * 1000);
        // console.log("Expiration date ", expirationDate);

        this.saveAuthData(this.token, expirationDate, this.userId);
        this.router.navigate(['/']);
      }
    }, err => {
      console.log("ERROR", err);
      this.authStatusListener.next(false);
      this._snackbar.open("Failed to login", "X", {
        duration: 3000
      })
    })
  }

  getUserId() {
    return this.userId;
  }

  signup(email: string, password: string) {
    const signupData: AuthData = {
      email: email,
      password: password
    }
    return this.http.post(BACKEND_URL + "signup", signupData)
  }

  logout() {
    this.token = null;
    this.isAuth = false;
    clearTimeout(this.setTimer);
    this.authStatusListener.next(false);
    this.clearAuthData();
    this.router.navigate(['/auth/login']);
  }

  private saveAuthData(token: string, expirationDate: Date, userId) {
    localStorage.setItem('token', token);
    localStorage.setItem('expirationDate', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.clear();
  }
}
