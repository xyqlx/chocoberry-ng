import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { LoginService } from './login/login.service';
import { Dialog } from '@angular/cdk/dialog';
import { SettingsComponent } from './settings/settings.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'chocoberry-ng';
  constructor(
    private authService: AuthService,
    private login: LoginService,
    public dialog: Dialog
  ) {}
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

  openSettingsDialog(){
    this.dialog.open(SettingsComponent, {
      width: '500px',
      height: '500px',
    });
  }
}
