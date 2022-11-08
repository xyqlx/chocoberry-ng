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
  isOpenRegister = false;
  permissions: string[] = [];
  ngOnInit(): void {
    this.authService.getUserInfo().subscribe(x=>{
      this.userInfo = x as {name: string, linuxUser: string, email: string};
    });
    this.checkRegisterState();
    this.authService.getPermissions().subscribe(x=>this.permissions = x);
  }

  get hasRegisterStateControlPermission(){
    return this.permissions.indexOf('control_register_state') >= 0;
  }

  checkRegisterState(){
    this.authService.isOpenRegister().subscribe(x=>{
      this.isOpenRegister = x;
    });
  }

  destroy(){
    this.authService.destroy().subscribe(x=>{
      // refresh
      window.location.reload();
    });
  }
  setRegisterState(isOpen: boolean){
    this.authService.setRegisterState(isOpen).subscribe(x=>{
      this.checkRegisterState();
    });
  }
}
