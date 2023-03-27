import { Component, OnInit } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { ChocoService } from '../choco/choco.service';

@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.scss'],
})
export class StatComponent implements OnInit {
  constructor(private choco: ChocoService) {}
  data: any;
  gpuCount = 0;
  async ngOnInit() {
    this.data = await this.choco.getAsync(
      'tasks/log/performance?days=1&sampleInterval=1'
    );
    // numbers of gpu
    const gpu = this.data[0].gpu;
    this.gpuCount = gpu.length;
  }
  async timeChange(event: MatButtonToggleChange) {
    this.data = [];
    const days = event.value;
    this.data = await this.choco.getAsync(
      `tasks/log/performance?days=${days}&sampleInterval=20`
    );
  }
}
