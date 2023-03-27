import { Component, OnInit } from '@angular/core';
import { ChocoService } from '../choco/choco.service';
import { Trigger } from './trigger';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.scss'],
})
export class NotifyComponent implements OnInit {
  constructor(private choco: ChocoService) {}

  triggers: Trigger[] = [];

  ngOnInit(): void {
    this.choco.getAsync('notify').then((triggers: Object) => {
      this.triggers = triggers as Trigger[];
    });
  }

  addTrigger(trigger: Trigger) {
    this.choco.postAsync('notify', trigger).then(() => {
      // maybe should be triggerd from server
      // refresh
      this.ngOnInit();
    });
  }
}
