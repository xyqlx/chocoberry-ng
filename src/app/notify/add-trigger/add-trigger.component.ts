import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChocoService } from 'src/app/choco/choco.service';
import { Trigger, triggerTypes, notifyTypes, triggerTypeLabels, notifyTypeLabels, TimeTrigger, GPUTrigger } from '../trigger';

@Component({
  selector: 'app-add-trigger',
  templateUrl: './add-trigger.component.html',
  styleUrls: ['./add-trigger.component.scss'],
})
export class AddTriggerComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  trigger: Trigger = new GPUTrigger(1, 'notify', new Date().getTime());
  timeTriggerDate = new Date();
  // HH:mm format
  timeTriggerTime = new Date().toTimeString().slice(0, 5);
  triggerTypes = triggerTypes;
  notifyTypes = notifyTypes;
  triggerTypeLabels = triggerTypeLabels;
  notifyTypeLabels = notifyTypeLabels;
  @Output() addTriggerEvent: EventEmitter<Trigger> =
    new EventEmitter<Trigger>();

  @Input() loading = false;

  addTrigger() {
    if(this.trigger.type === 'time') {
      const time = new Date(this.timeTriggerDate.toDateString() + ' ' + this.timeTriggerTime).getTime();
      this.trigger.payload = {
        time
      };
    }
    this.addTriggerEvent.emit(this.trigger);
  }

  onTriggerTypeChanged(value: string) {
    if(value === 'time') {
      this.trigger.payload = {
        time: new Date().getTime()
      };
    }
    else if(value === 'gpu') {
      this.trigger.payload = { };
    }
    else if(value === 'process') {
      this.trigger.payload = {
        processId: 0
      };
    }
  }
}
