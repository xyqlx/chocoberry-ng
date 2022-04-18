import { Component, Input, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { squeezeMetric } from '../tools/metric'

@Component({
  selector: 'app-cpu-mem-chart',
  templateUrl: './cpu-mem-chart.component.html',
  styleUrls: ['./cpu-mem-chart.component.scss']
})
export class CpuMemChartComponent implements OnInit {
  chartOption?: EChartsOption;
  constructor() { }

  @Input('data') set data(data: any[] | undefined) {
    if(!data){
      return;
    }
    // ISO format to Date
    const cpu = data.map(item => [new Date(item.time), item.cpu.percent]);
    const mem = data.map(item => [new Date(item.time), item.mem.total - item.mem.free]);
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
        data: ['CPU', 'MEM'],
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
          name: 'CPU',
          min: 0,
          max: 100,
        },
        {
          type: 'value',
          name: 'MEM',
          min: 0,
          // 硬编码
          max: 64
        }
      ],
      series: [
        {
          data: cpu,
          name: 'CPU',
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

  ngOnInit(): void {
  }

}
