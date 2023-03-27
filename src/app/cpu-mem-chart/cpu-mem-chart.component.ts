import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { Component, Injector, Input, OnInit } from '@angular/core';
import { ECharts, EChartsOption } from 'echarts';
import { squeezeMetric } from '../tools/metric';

@Component({
  selector: 'app-cpu-mem-chart',
  templateUrl: './cpu-mem-chart.component.html',
  styleUrls: ['./cpu-mem-chart.component.scss'],
})
export class CpuMemChartComponent implements OnInit {
  chartOption?: EChartsOption;
  constructor(private overlay: Overlay, private injector: Injector) {}

  @Input('data') set data(data: any[] | undefined) {
    if (!data) {
      return;
    }
    if (data?.length === 0) {
      this.chart?.showLoading();
    } else {
      this.chart?.hideLoading();
    }
    // ISO format to Date
    const cpu = data.map((item) => [new Date(item.time), item.cpu.percent]);
    const mem = data.map((item) => [
      new Date(item.time),
      item.mem.total - item.mem.free,
    ]);
    this.chartOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          animation: false,
          label: {
            backgroundColor: '#505765',
          },
        },
      },
      legend: {
        data: ['CPU', 'MEM'],
        left: 10,
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100,
        },
        {
          start: 0,
          end: 100,
        },
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
          max: 64,
        },
      ],
      toolbox: {
        show: true,
        feature: {
          myZoomIn: {
            show: true,
            title: '放大',
            // https://iconmonstr.com/zoom-in-thin-svg/
            icon: 'path://M15.853 16.56c-1.683 1.517-3.911 2.44-6.353 2.44-5.243 0-9.5-4.257-9.5-9.5s4.257-9.5 9.5-9.5 9.5 4.257 9.5 9.5c0 2.442-.923 4.67-2.44 6.353l7.44 7.44-.707.707-7.44-7.44zm-6.353-15.56c4.691 0 8.5 3.809 8.5 8.5s-3.809 8.5-8.5 8.5-8.5-3.809-8.5-8.5 3.809-8.5 8.5-8.5zm-4.5 8h4v-4h1v4h4v1h-4v4h-1v-4h-4v-1z',
            onclick: () => {
              // change echart figure size
            },
          },
        },
      },
      series: [
        {
          data: cpu,
          name: 'CPU',
          type: 'line',
          lineStyle: {
            width: 1,
          },
          emphasis: {
            focus: 'series',
          },
          showSymbol: false,
        },
        {
          data: mem,
          name: 'MEM',
          type: 'line',
          lineStyle: {
            width: 1,
          },
          emphasis: {
            focus: 'series',
          },
          showSymbol: false,
        },
      ],
    };
  }

  chart?: ECharts;
  onChartInit(ec: ECharts) {
    this.chart = ec;
    console.log(this.chart);
  }

  ngOnInit(): void {}
}
