import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor(
    private authService: AuthService
  ) { }

  userInfo?: {name: string, linuxUser: string, email: string};
  ngOnInit(): void {
    this.authService.getUserInfo().subscribe(x=>{
      this.userInfo = x as {name: string, linuxUser: string, email: string};
    })
  }

  destroy(){
    this.authService.destroy().subscribe(x=>{
      // refresh
      window.location.reload();
    });
  }
}
