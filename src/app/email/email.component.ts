import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ChocoService } from '../choco/choco.service';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit {

  constructor(
    private choco: ChocoService
  ) { }

  form: FormGroup = new FormGroup({
    'content': new FormControl('')
  });

  async send() {
    await this.choco.postAsync('email', { 'subject': 'ChocoBerry!!!', text: this.form.value.content });
  }

  ngOnInit(): void {
  }

}
