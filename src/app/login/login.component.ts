import { Component, Inject, InjectionToken, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { catchError, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';

export const LOGIN_EVENT = new InjectionToken<{}>('LOGIN_EVENT');

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(@Inject(LOGIN_EVENT) public loginEvent: any, private auth: AuthService) { }

  hide: boolean = true;
  ngOnInit(): void {
  }
  form: FormGroup = new FormGroup({
    'username': new FormControl(''),
    'password': new FormControl('')
  });
  login(){
    const value = this.form.value;
    this.auth.login(value.username, value.password)
      .pipe(catchError(err => { console.log(err); return of();}))
      .subscribe(res => {this.loginEvent();});
  }

}
