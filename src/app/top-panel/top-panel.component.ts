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

  constructor(private choco: ChocoService) {
    const source = interval(2000);
    this.topSubscription = source.subscribe(async () => {
      await this.queryCPU();
      await this.queryMem();
      await this.queryTop();
    });
  }

  async queryTop(){
    const topInfo = await this.choco.getAsync(`process/top`) as any[];
    this.topInfo = topInfo.slice(0, 5);
  }
  async queryCPU(){
    this.cpuInfo = await this.choco.getAsync(`cpu`);
  }
  async queryMem(){
    this.memInfo = await this.choco.getAsync(`memory`);
  }

  ngOnInit(): void {
  }
  ngOnDestroy() {
    this.topSubscription.unsubscribe();
  }
}
