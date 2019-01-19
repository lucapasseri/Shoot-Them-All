import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import {TokenResponse, User, UserData, UserDetails} from "../models/user";

// Interfaces here

@Injectable()
export class AuthenticationService {
  private token: string;

  constructor(private http: HttpClient, private router: Router) {}

  private saveToken(token: string): void {
    localStorage.setItem('mean-token', token);
    this.token = token;
  }

  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('mean-token');
    }
    return this.token;
  }

  public logout(): void {
    this.token = '';
    window.localStorage.removeItem('mean-token');
    this.router.navigateByUrl('login');
  }

  public getUserDetails(): UserDetails {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    if (user) {
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  private request(method: 'post'|'get'|'put'|'delete', url: string, body?: any): Observable<any> {
    var base;

    const httpHeader = { headers: { Authorization: `Bearer ${this.getToken()}` }};

    if (method === 'post') {
      base = this.http.post(url, body, httpHeader);
    } else if (method === 'get') {
      base = this.http.get(url, httpHeader);
    }

    const request = base.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token);
        }
        return data;
      })
    );

    return request;
  }

  login(userData: UserData): Observable<any>  {
    return this.request('post', "/api/login", userData);
  }

  register(user: User): Observable<any> {
    return this.request('post', "/api/registration", user)
  }


}


