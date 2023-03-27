import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { ChocoService } from '../choco/choco.service';

@Component({
  selector: 'app-net-traffic',
  templateUrl: './net-traffic.component.html',
  styleUrls: ['./net-traffic.component.scss'],
})
export class NetTrafficComponent implements OnInit, OnDestroy {
  trafficSubscription: Subscription;

  trafficInfo: any[] = [];
  displayedColumns = ['name', 'user', 'pid', 'received', 'sent'];
  shouldUpdate = true;

  constructor(private choco: ChocoService) {
    const source = interval(1000);
    this.trafficSubscription = source.subscribe(async () => {
      if (this.shouldUpdate) {
        await this.queryTraffic();
      }
    });
  }
  continueUpdate() {
    this.shouldUpdate = true;
  }
  stopUpdate() {
    this.shouldUpdate = false;
  }

  async queryTraffic() {
    const trafficInfo = (await this.choco.getAsync(`net-traffic`)) as any[];
    this.trafficInfo = trafficInfo.slice(0, 3);
    // query process for each topInfo
    for (const info of this.trafficInfo) {
      // console.log(info.process)
    }
  }

  ngOnInit(): void {}
  ngOnDestroy() {
    this.trafficSubscription.unsubscribe();
  }
}
