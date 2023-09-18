import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ChocoService } from 'src/app/choco/choco.service';
import { Trigger, triggerTypes, notifyTypes } from '../trigger';

@Component({
  selector: 'app-add-trigger',
  templateUrl: './add-trigger.component.html',
  styleUrls: ['./add-trigger.component.scss'],
})
export class AddTriggerComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  trigger: Trigger = new Trigger(
    'time',
    1,
    { time: new Date().getTime() },
    'notify',
    new Date().getTime()
  );
  triggerTypes = triggerTypes;
  notifyTypes = notifyTypes;
  @Output() addTriggerEvent: EventEmitter<Trigger> =
    new EventEmitter<Trigger>();

  addTrigger() {
    this.addTriggerEvent.emit(this.trigger);
  }
}
