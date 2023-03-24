import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChocoService } from "../choco/choco.service";
import { interval, Subscription } from 'rxjs';

declare type GPUInfo = {
  name: string, memUsed: number, memTotal: number, utilization: number,
  processes: { pid: number, ppid: number, uid: number, user?: string, gid: number, name: string, bin: string, cmd: string, cwd?: string, starttime?: string }[]
};

@Component({
  selector: 'app-gpu',
  templateUrl: './gpu.component.html',
  styleUrls: ['./gpu.component.scss']
})
export class GpuComponent implements OnInit, OnDestroy {
  constructor(private choco: ChocoService) {
    const source = interval(2000);
    this.gpuSubscription = source.subscribe(async () => await this.queryGPU());
  }
  gpuSubscription: Subscription;
  gpus: GPUInfo[] = [];
  cudaVersion = '';

  ngOnInit() {

  }
  ngOnDestroy() {
    this.gpuSubscription.unsubscribe();
  }
  async queryGPU() {
    const gpus: GPUInfo[] = [];
    const info: any = await this.choco.getAsync('gpu');
    if (!info) {
      return;
    }
    this.cudaVersion = info['cuda_version'];
    for (const gpu of info['gpu']) {
      const gpuInfo: GPUInfo = {
        name: gpu['product_name'],
        memUsed: this.getNumber(gpu['fb_memory_usage']['used']),
        memTotal: this.getNumber(gpu['fb_memory_usage']['total']),
        utilization: this.getNumber(gpu['utilization']['gpu_util']),
        processes: []
      };
      const processes = gpu['processes'];
      if (processes !== '\n\t\t') {
        if(Array.isArray(processes['process_info'])){
          for(const p of processes['process_info']){
            const pid = Number(p['pid']);
            try{
              const process = await this.choco.findProcess(pid);
              (process as any).usedmemory = this.getNumber(p['used_memory']) ?? 0;
              gpuInfo.processes.push(process as any);
            }
            catch{}
          }
        }else{
          const pid = Number(processes['process_info']['pid']);
          if(!isNaN(pid)){
            try {
              const process = await this.choco.findProcess(pid);
              (process as any).usedmemory = this.getNumber(processes['process_info']['used_memory']) ?? 0;
              gpuInfo.processes.push(process as any);
            }catch{}
          }
        }
      }
      gpus.push(gpuInfo);
    }
    if(this.gpus.length !== gpus.length) {
      this.gpus = gpus;
    }else{
      for(let i = 0; i < this.gpus.length; i++){
        this.gpus[i].memUsed = gpus[i].memUsed;
        this.gpus[i].memTotal = gpus[i].memTotal;
        this.gpus[i].utilization = gpus[i].utilization;
        if(this.gpus[i].processes.length === gpus[i].processes.length){
          for(let j = 0; j < this.gpus[i].processes.length; j++){
            if(gpus[i].processes[j].pid !== this.gpus[i].processes[j].pid
              || gpus[i].processes[j].cmd !== this.gpus[i].processes[j].cmd){
              this.gpus[i].processes[j] = gpus[i].processes[j];
            }
          }
        }
        else{
          this.gpus[i].processes = [...gpus[i].processes];
        }
      }
    }
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
  getDurationFromNow(rawDateText: string){
    const date = new Date(rawDateText);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if(days > 0){
      return `${days}d`;
    }
    if(hours > 0){
      return `${hours}h`;
    }
    if(minutes > 0){
      return `${minutes}m`;
    }
    return `${seconds}s`;
  }
}
