import { Component, Input, OnInit } from '@angular/core';
import { ECharts, EChartsOption } from 'echarts';

@Component({
  selector: 'app-gpu-chart',
  templateUrl: './gpu-chart.component.html',
  styleUrls: ['./gpu-chart.component.scss']
})
export class GpuChartComponent implements OnInit {
  chartOption?: EChartsOption;
  constructor() { }

  ngOnInit(): void {
  }
  _gpuIndex: number | undefined;
  @Input('gpuIndex') set gpuIndex(gpuIndex: number){
    this._gpuIndex = gpuIndex;
    this.updateData();
  }
  get gpuUndefined(): boolean {
    return typeof(this._gpuIndex) === 'undefined';
  }
  _data: any[] | undefined;
  @Input('data') set data(data: any[] | undefined) {
    this._data = data;
    if(data?.length === 0){
      this.chart?.showLoading();
    }else{
      this.chart?.hideLoading();
    }
    this.updateData();
  }

  chart?: ECharts;
  onChartInit(ec: ECharts) {
    this.chart = ec;
    console.log(this.chart);
  }

  updateData() {
    if(!this._data || this.gpuUndefined){
      return;
    }
    // ISO format to Date
    const utilization = this._data.map(item => [new Date(item.time), item.gpu[this._gpuIndex!].utilization]);
    const mem = this._data.map(item => [new Date(item.time), item.gpu[this._gpuIndex!].memUsed/1024]);
    this.chartOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          animation: false,
          label: {
            backgroundColor: '#505765'
          }
        }
      },
      legend: {
        data: ['utilization', 'MEM'],
        left: 10
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100
        },
        {
          start: 0,
          end: 100
        }
      ],
      xAxis: {
        type: 'time',
      },
      yAxis: [
        {
          type: 'value',
          name: 'utilization',
          min: 0,
          max: 100,
        },
        {
          type: 'value',
          name: 'MEM',
          min: 0,
          // 硬编码
          max: 12
        }
      ],
      series: [
        {
          data: utilization,
          name: 'utilization',
          type: 'line',
          lineStyle: {
            width: 1
          },
          emphasis: {
            focus: 'series'
          },
          showSymbol: false,
        },
        {
          data: mem,
          name: 'MEM',
          type: 'line',
          lineStyle: {
            width: 1
          },
          emphasis: {
            focus: 'series'
          },
          showSymbol: false,
        }
      ],
    };
  }

}
