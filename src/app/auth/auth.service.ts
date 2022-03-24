import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private base = environment.apiUrl;
  constructor(private http: HttpClient) { }
  login(username: string, password: string){
    return this.http.post(this.base + 'auth/login', {username, password});
  }
}
