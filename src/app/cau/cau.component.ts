import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ChocoService } from '../choco/choco.service';

@Component({
  selector: 'app-cau',
  templateUrl: './cau.component.html',
  styleUrls: ['./cau.component.scss']
})
export class CauComponent implements OnInit {

  constructor(private choco: ChocoService) { }

  username = '';
  hide = true;
  form: UntypedFormGroup = new UntypedFormGroup({
    'username': new UntypedFormControl(''),
    'password': new UntypedFormControl('')
  });

  async ngOnInit(): Promise<void> {
    await this.updateStatus();
  }

  async updateStatus(){
    const status = await this.choco.getAsync('cau') as {status: string, username?: string};
    if (status.status === 'login') {
      this.username = status.username!;
    }
  }

  async login(): Promise<void> {
    const value = this.form.value;
    await this.choco.postAsync('cau', value);
    await this.updateStatus();
  }

  async logout(): Promise<void> {
    await this.choco.deleteAsync('cau');
    await this.updateStatus();
  }
}
