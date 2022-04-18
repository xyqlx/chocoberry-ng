import { Component, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { ChocoService } from '../choco/choco.service';

@Component({
  selector: 'app-top-panel',
  templateUrl: './top-panel.component.html',
  styleUrls: ['./top-panel.component.scss']
})
export class TopPanelComponent implements OnInit {
  topSubscription: Subscription;

  topInfo: any[] = [];
  cpuInfo: any;
  memInfo: any;
  displayedColumns = ['command', 'user', 'cpu', 'mem'];
  shouldUpdate = true;

  constructor(private choco: ChocoService) {
    const source = interval(2000);
    this.topSubscription = source.subscribe(async () => {
      if (this.shouldUpdate) {
        await this.queryTop();
      }
      await this.queryCPU();
      await this.queryMem();
    });
  }
  continueUpdate() {
    this.shouldUpdate = true;
  }
  stopUpdate() {
    this.shouldUpdate = false;
  }

  async queryTop() {
    const topInfo = await this.choco.getAsync(`process/top`) as any[];
    this.topInfo = topInfo.slice(0, 5);
    // query process for each topInfo
    for (const info of this.topInfo) {
      const pid = Number(info.PID);
      if (pid !== NaN) {
        try {
          const process = await this.choco.findProcess(pid);
          info.process = process as any;
        } catch { }
      }
      // console.log(info.process)
    }
  }
  async queryCPU() {
    this.cpuInfo = await this.choco.getAsync(`cpu`);
  }
  async queryMem() {
    this.memInfo = await this.choco.getAsync(`memory`);
  }

  ngOnInit(): void {
  }
  ngOnDestroy() {
    this.topSubscription.unsubscribe();
  }
}
