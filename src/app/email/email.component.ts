import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
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

  form: UntypedFormGroup = new UntypedFormGroup({
    'content': new UntypedFormControl('')
  });

  async send() {
    await this.choco.postAsync('email', { 'subject': 'ChocoBerry!!!', text: this.form.value.content });
  }

  ngOnInit(): void {
  }

}
