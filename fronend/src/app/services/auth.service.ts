import { Injectable } from '@angular/core';
import {Http, Headers, ResponseContentType} from '@angular/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authToken: any;
  user: any;
  url: any;
  constructor(private http:Http, private jwthelperSerivice: JwtHelperService) { }

  registerUser(user) {
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/api/users/register', user, {headers: headers})
      .pipe(map(res => res.json()));
  }
  getImage(url) {
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.get('http://localhost:3000/'+url, {headers: headers});
  }
  editUser(user) {
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.put('http://localhost:3000/api/users/profile/'+`${user.id}`, user, {headers: headers})
      .pipe(map(res => res.json()));
  }
  authenticateUser(user) {
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/api/users/authenticate', user, {headers: headers})
      .pipe(map(res => res.json()));
  } 
  storeUserData(token, user) {
    localStorage.setItem('id_token',token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }
  logout() {
    this.user = null;
    this.authToken = null;
    localStorage.clear();
  }
  getProfile() {
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type','application/json');
    return this.http.get('http://localhost:3000/api/users/profile', {headers: headers})
      .pipe(map(res => res.json()));
  }
  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }
  loggedIn() {
    return this.jwthelperSerivice.isTokenExpired();

  }
}

