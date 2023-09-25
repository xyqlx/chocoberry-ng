import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChocoService } from '../choco/choco.service';
import { Trigger } from './trigger';
import { Store } from '@ngrx/store';
import { selectTrigger } from "./store/trigger.selectors";
import { interval } from 'rxjs';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.scss'],
})
export class NotifyComponent implements OnInit, OnDestroy {
  constructor(
    private choco: ChocoService,
    private store: Store
  ) {}

  triggers: Trigger[] = [];
  autoRefreshSubscription: any;
  loading = false;

  refreshTriggers() {
    this.choco.getAsync('notify').then((triggers: Object) => {
      this.triggers = triggers as Trigger[];
      this.loading = false;
    });
  }

  ngOnInit(): void {
    this.store.select(selectTrigger).subscribe((trigger) => {
      this.refreshTriggers();
    });
    this.refreshTriggers();
    this.autoRefreshSubscription = interval(5000).subscribe(() => {
      this.refreshTriggers();
    });
  }

  addTrigger(trigger: Trigger) {
    this.loading = true;
    this.choco.postAsync('notify', trigger).then(() => {
      // this.loading = false;
    });
  }

  ngOnDestroy() {
    this.autoRefreshSubscription.unsubscribe();
  }
}
