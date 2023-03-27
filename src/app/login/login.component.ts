import { Component, Inject, InjectionToken, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { catchError, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';

export const LOGIN_EVENT = new InjectionToken<{}>('LOGIN_EVENT');

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    @Inject(LOGIN_EVENT) public loginEvent: any,
    private auth: AuthService
  ) {}

  hide: boolean = true;
  mode: 'login' | 'register' = 'login';
  errorInfo: string = '';
  isOpenRegister = false;
  ngOnInit(): void {
    this.auth.isOpenRegister().subscribe((x) => {
      this.isOpenRegister = x;
    });
  }
  form: UntypedFormGroup = new UntypedFormGroup({
    username: new UntypedFormControl(''),
    password: new UntypedFormControl(''),
  });
  registerForm: UntypedFormGroup = new UntypedFormGroup({
    username: new UntypedFormControl(''),
    password: new UntypedFormControl(''),
    linuxUser: new UntypedFormControl(''),
    email: new UntypedFormControl(''),
  });
  login() {
    const value = this.form.value;
    this.auth
      .login(value.username, value.password)
      .pipe(
        catchError((err) => {
          this.errorInfo = err['error']['message'];
          return of();
        })
      )
      .subscribe((res) => {
        this.loginEvent();
      });
  }
  register() {
    const value = this.registerForm.value;
    this.auth
      .register(value.username, value.password, value.linuxUser, value.email)
      .pipe(
        catchError((err) => {
          this.errorInfo = err['error']['message'];
          return of();
        })
      )
      .subscribe((res) => {
        this.loginEvent();
      });
  }
}
