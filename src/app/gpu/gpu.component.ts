import { Component, OnInit } from '@angular/core';
import { ChocoService } from "../choco/choco.service";

@Component({
  selector: 'app-gpu',
  templateUrl: './gpu.component.html',
  styleUrls: ['./gpu.component.scss']
})
export class GpuComponent implements OnInit {

  constructor(private choco: ChocoService) { }
  cuda_version = '';

  ngOnInit(): void {
    this.choco.getGpu().subscribe(x=>{
      const info = x as any;
      if(info['cuda_version']){
        this.cuda_version = info['cuda_version'];
      }
    })
  }

}
