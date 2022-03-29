import { Component, OnDestroy, OnInit } from '@angular/core';
import { find, firstValueFrom } from 'rxjs';
import { ChocoService } from "../choco/choco.service";
import { interval, Subscription } from 'rxjs';

declare type GPUInfo = {
  name: string, memUsed: number, memTotal: number, utilization: number,
  process?: { pid: number, ppid: number, uid: number, user?: string, gid: number, name: string, bin: string, cmd: string, cwd?: string }
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
      };
      const processes = gpu['processes'];
      if (processes !== '\n\t\t') {
        const pid = Number(processes['process_info']['pid']);
        const process = await this.choco.findProcess(pid);
        gpuInfo.process = process as any;
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
        if(gpus[i].process !== this.gpus[i].process){
          this.gpus[i].process = gpus[i].process;
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
}
