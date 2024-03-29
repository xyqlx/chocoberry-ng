import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map, tap } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private base = environment.apiUrl;
  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {}
  login(username: string, password: string) {
    return this.http
      .post<{ access_token: string }>(this.base + 'auth/login', {
        username,
        password,
      })
      .pipe(
        tap((res) => localStorage.setItem('access_token', res.access_token))
      );
  }
  register(
    username: string,
    password: string,
    linuxUser: string,
    email: string
  ) {
    return this.http
      .post<{ access_token: string }>(this.base + 'auth/register', {
        username,
        password,
        linuxUser,
        email,
      })
      .pipe(
        tap((res) => localStorage.setItem('access_token', res.access_token))
      );
  }
  logout() {
    localStorage.removeItem('access_token');
  }
  destroy() {
    return this.http
      .post(this.base + 'auth/destroy', {})
      .pipe(tap(() => this.logout()));
  }
  getUserInfo() {
    return this.http.get(this.base + 'auth/userinfo');
  }
  getPermissions() {
    return this.http
      .get(this.base + 'auth/permissions')
      .pipe(map((x) => x as string[]));
  }
  isOpenRegister() {
    return this.http
      .get(this.base + 'auth/registerState')
      .pipe(map((v) => (v as { isOpen: boolean }).isOpen));
  }
  setRegisterState(isOpen: boolean) {
    return this.http.post(this.base + 'auth/registerState', { isOpen });
  }
  public get loggedIn(): boolean {
    if(environment.demo){
      return true;
    }
    const token = localStorage.getItem('access_token');
    // 输出凭证过期时间
    // console.log(this.jwtHelper.getTokenExpirationDate(token ?? undefined));
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }
}
