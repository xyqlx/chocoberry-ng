import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { LoginComponent } from '../login/login.component';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private login: LoginService,
    private auth: AuthService) { }

  get loggedin(){
    return this.auth.loggedIn;
  }
  
  ngOnInit(): void {
    // 如果停留在此页面时凭证过期则不会弹出自动登录窗口
    if(!this.loggedin){
      this.login.showLogin();
    }
  }

  
}
