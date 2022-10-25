import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { LoginService } from './login/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'chocoberry-ng';
  constructor(
    private authService: AuthService,
    private login: LoginService
  ) { }
  logout() {
    this.authService.logout();
    // refresh
    window.location.reload();
  }
  get loggedin() {
    return this.authService.loggedIn;
  }

  ngOnInit(): void {
    // 如果停留在此页面时凭证过期则不会弹出自动登录窗口
    if (!this.loggedin) {
      this.login.showLogin();
    }
  }
}
