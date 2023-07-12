import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChocoService } from '../choco/choco.service';
import { interval, Subscription } from 'rxjs';
import { ColorGenerator } from '../color-generator/ColorGenerator';
import { ProcessColorService } from '../color-generator/process-color.service';

declare type GPUInfo = {
  name: string;
  memUsed: number;
  memTotal: number;
  utilization: number;
  processes: {
    pid: number;
    ppid: number;
    uid: number;
    user?: string;
    gid: number;
    name: string;
    bin: string;
    cmd: string;
    cwd?: string;
    starttime?: string;
  }[];
};

@Component({
  selector: 'app-gpu',
  templateUrl: './gpu.component.html',
  styleUrls: ['./gpu.component.scss'],
})
export class GpuComponent implements OnInit, OnDestroy {
  constructor(
      private choco: ChocoService,
      private processColorService: ProcessColorService
    ) {
    const source = interval(2000);
    this.gpuSubscription = source.subscribe(async () => await this.queryGPU());
  }
  gpuSubscription: Subscription;
  gpus: GPUInfo[] = [];
  cudaVersion = '';

  ngOnInit() { }
  ngOnDestroy() {
    this.gpuSubscription.unsubscribe();
  }
  async queryGPU() {
    const info: any = await this.choco.getAsync('gpu/summary');
    if (!info) {
      return;
    }
    this.cudaVersion = info['cuda_version'];
    const gpus = info['gpus'] as GPUInfo[];
    if (this.gpus.length !== gpus.length) {
      this.gpus = gpus;
    } else {
      for (let i = 0; i < this.gpus.length; i++) {
        this.gpus[i].memUsed = gpus[i].memUsed;
        this.gpus[i].memTotal = gpus[i].memTotal;
        this.gpus[i].utilization = gpus[i].utilization;
        if (this.gpus[i].processes.length === gpus[i].processes.length) {
          for (let j = 0; j < this.gpus[i].processes.length; j++) {
            if (
              gpus[i].processes[j].pid !== this.gpus[i].processes[j].pid ||
              gpus[i].processes[j].cmd !== this.gpus[i].processes[j].cmd
            ) {
              this.gpus[i].processes[j] = gpus[i].processes[j];
            }
          }
        } else {
          this.gpus[i].processes = [...gpus[i].processes];
        }
      }
    }
  }
  getProcessColor(pid: number) {
    return this.processColorService.colorGenerator.get(pid);
  }
  get memoryUsagePerProcess(): { color: string, value: number }[][] {
    const memInfo: { total: number, used: number, processes: { pid: number, used: number }[] }[] = this.gpus.map(
      (gpu) => ({
        total: gpu.memTotal,
        used: gpu.memUsed,
        processes: gpu.processes.map((p: any) => ({
          pid: p.pid,
          used: p.usedmemory,
        })),
      })
    );
    let result: { color: string, value: number }[][] = [];
    // 统计进程列表
    const pidList: Set<number> = new Set();
    for (const gpu of memInfo) {
      for (const p of gpu.processes) {
        pidList.add(p.pid);
      }
    }
    // 自动清理过期进程颜色
    this.processColorService.colorGenerator.autoClear(pidList);
    // 为每个进程分配随机颜色
    const pidColorMap: Map<number, string> = new Map();
    for (const pid of pidList) {
      pidColorMap.set(pid, this.processColorService.colorGenerator.get(pid));
    }
    // 将进程映射为颜色
    for (const gpu of memInfo) {
      const gpuResult: { color: string, value: number }[] = [];
      for (const p of gpu.processes) {
        gpuResult.push({
          color: pidColorMap.get(p.pid) ?? '#000',
          value: p.used / gpu.total,
        });
      }
      result.push(gpuResult);
    }
    return result;
  }
  getNumber(text: string) {
    const reg = /\d+/g;
    const result = text.match(reg);
    if (!result) {
      return 0;
    }
    return Number(result[0]);
  }
  getReadableTime(rawText: string) {
    const date = new Date(rawText);
    return date.toLocaleString();
  }
  getDurationFromNow(rawDateText: string) {
    const date = new Date(rawDateText);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) {
      return `${days}d`;
    }
    if (hours > 0) {
      return `${hours}h`;
    }
    if (minutes > 0) {
      return `${minutes}m`;
    }
    return `${seconds}s`;
  }
}
