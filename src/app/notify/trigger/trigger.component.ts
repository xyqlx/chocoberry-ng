import { Component, Input, OnInit } from '@angular/core';
import { Trigger, triggerTypeLabels, notifyTypeLabels } from '../trigger';

@Component({
  selector: 'app-trigger',
  templateUrl: './trigger.component.html',
  styleUrls: ['./trigger.component.scss'],
})
export class TriggerComponent implements OnInit {
  constructor() {}

  triggerTypeLabels = triggerTypeLabels;
  notifyTypeLabels = notifyTypeLabels;

  @Input() trigger: Trigger = new Trigger(
    'time',
    1,
    {},
    'email',
    new Date().getTime()
  );

  get created() {
    return new Date(this.trigger.created).toLocaleString();
  }

  get timeTriggerTime() {
    return new Date(this.trigger.payload.time).toLocaleString();
  }

  ngOnInit(): void {}
}
