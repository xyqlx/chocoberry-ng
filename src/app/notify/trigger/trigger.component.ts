import { Component, Input, OnInit } from '@angular/core';
import { Trigger, triggerTypeLabels, notifyTypeLabels } from '../trigger';
import { ChocoService } from 'src/app/choco/choco.service';

@Component({
  selector: 'app-trigger',
  templateUrl: './trigger.component.html',
  styleUrls: ['./trigger.component.scss'],
})
export class TriggerComponent implements OnInit {
  constructor(
    private choco: ChocoService
  ) {}

  triggerTypeLabels = triggerTypeLabels;
  notifyTypeLabels = notifyTypeLabels;
  loading = false;

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

  removeTrigger() {
    this.loading = true;
    this.choco.deleteAsync(`notify/${this.trigger.created}`).then(() => {
      // this.loading = false;
      // 没错这里不需要修改状态因为移除了之后整个组件都没了
    });
  }

  ngOnInit(): void {}
}
