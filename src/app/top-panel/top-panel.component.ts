import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { ChocoService } from '../choco/choco.service';
import { ECharts, EChartsOption } from 'echarts';
import { ProcessColorService } from '../color-generator/process-color.service';
import { Store } from '@ngrx/store';
import { selectTopChartSettings } from '../state/top-chart-settings.selectors';
import { MatButtonToggleChange } from '@angular/material/button-toggle';

// create a note type
type ProcessNode = {
  pid: number,
  ppid: number,
  cpu: number,
  mem: number,
  sum_cpu: number,
  sum_mem: number,
  children: ProcessNode[],
  user: string,
  command: string
};

@Component({
  selector: 'app-top-panel',
  templateUrl: './top-panel.component.html',
  styleUrls: ['./top-panel.component.scss'],
})
export class TopPanelComponent implements OnInit, OnDestroy {
  topSubscription: Subscription;
  cpuInfo: any;
  memInfo: any;
  displayedColumns = ['command', 'user', 'cpu', 'mem'];
  shouldUpdate = true;
  chartOption?: EChartsOption;
  chart?: ECharts;
  constructor(
    private choco: ChocoService,
    private processColor: ProcessColorService,
    private store: Store
  ) {
    const source = interval(5000);
    this.topSubscription = source.subscribe(async () => {
      await this.queryCPU();
      await this.queryMem();
      if (this.shouldUpdate) {
        await this.renderTreeMap();
      }
    });
    this.topChartSettings$.subscribe((settings) => {
      this.leafDepth = settings.leafDepth;
      this.renderTreeMap();
    });
  }
  topChartSettings$ = this.store.select(selectTopChartSettings);
  leafDepth = 7;
  continueUpdate() {
    this.shouldUpdate = true;
  }
  stopUpdate() {
    this.shouldUpdate = false;
  }
  toFloatWithUnit(value: string) {
    const unit = value.slice(-1);
    const num = parseFloat(value.slice(0, -1));
    switch (unit) {
      case 'k':
        return num * 1024;
      case 'm':
        return num * 1024 * 1024;
      case 'g':
        return num * 1024 * 1024 * 1024;
      case 't':
        return num * 1024 * 1024 * 1024 * 1024;
      default:
        return num;
    }
  }
  async queryCPU() {
    this.cpuInfo = await this.choco.getAsync(`cpu`);
  }
  async queryMem() {
    this.memInfo = await this.choco.getAsync(`memory`);
  }

  ngOnInit(): void { }
  ngOnDestroy() {
    this.topSubscription.unsubscribe();
  }

  onChartInit(ec: ECharts) {
    this.chart = ec;
  }
  chartMode = 'cpu';
  changeChartMode($event: MatButtonToggleChange) {
    this.chartMode = $event.value;
    this.renderTreeMap();
  }
  psInfoMapReverse = new Map<number, number[]>();
  processTree: ProcessNode = {
    pid: -1, ppid: -1, cpu: 0, mem: 0, sum_cpu: 0, sum_mem: 0, children: [], user: '', command: ''
  };
  async renderTreeMap() {
    // 根据PID和PPID的关系构造一颗树
    this.processTree = await this.choco.getAsync(`process/tree`) as ProcessNode;
    if (this.chartMode === 'cpu') {
      this.updateCPUChart();
    } else {
      this.updateMemoryChart();
    }
  }
  updateCPUChart() {
    // 根据cpuInfo.percent计算空闲CPU使用率，注意核心数
    if (this.cpuInfo === undefined) {
      return;
    }
    const cpuIdle = 100 * (1 - this.cpuInfo.percent / 100) * this.cpuInfo.logicCores;
    // 包装树节点，用于生成图表
    const treeData = this.wrapTree(this.processTree, 'cpu');
    // 添加空闲CPU使用率
    treeData.children.push({
      name: 'idle',
      value: cpuIdle,
      itemStyle: {
        color: '#ccc',
      },
    });
    this.chartOption = {
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove'
      },
      series: [
        {
          type: 'treemap',
          data: [treeData],
          visibleMin: 100,
          label: {
            show: true,
            formatter: '{b}'
          },
          itemStyle: {
            borderColor: '#fff'
          },
          leafDepth: this.leafDepth,
          animationDuration: 550,
          animationDurationUpdate: 750
        }
      ]
    }
  }

  updateMemoryChart() {
    // 包装树节点，用于生成图表
    const treeData = this.wrapTree(this.processTree, 'mem');
    // 因为psInfo中的内存百分比并不精确，可能会受到共享内存等因素的影响，总和与实际情况差别很大，所以内存的估算成分较大
    const memoryIdle = this.memInfo.free / (this.memInfo.total - this.memInfo.free) * treeData.value;
    // 添加空闲使用率
    treeData.children.push({
      name: 'idle',
      value: memoryIdle,
      itemStyle: {
        color: '#ccc',
      },
    });
    this.chartOption = {
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove'
      },
      series: [
        {
          type: 'treemap',
          data: [treeData],
          visibleMin: 100,
          label: {
            show: true,
            formatter: '{b}'
          },
          itemStyle: {
            borderColor: '#fff'
          },
          leafDepth: this.leafDepth,
          animationDuration: 550,
          animationDurationUpdate: 750
        }
      ]
    }
  }

  // 包装树节点，用于生成图表（剪掉小于1的节点）
  wrapTree(node: ProcessNode, valueType: string): { name: string, value: number, children: any, itemStyle?: any, tooltip: any } {
    const valueLabel = valueType === 'cpu' ? 'sum_cpu' : 'sum_mem';
    const children = node.children.map((child) => {
      return this.wrapTree(child, valueType);
    });
    let itemStyle = undefined;
    // 如果能从processColor中找到对应的颜色，就用对应的颜色，否则用随机颜色
    if (this.processColor.colorGenerator.exists(node.pid)) {
      itemStyle = {
        color: this.processColor.colorGenerator.get(node.pid)
      };
    } else {
      const seed = (node.pid % 1000) / 1000;
      itemStyle = {
        color: this.processColor.colorGenerator.tempMapColor(seed)
      };
    }
    return {
      name: node.pid.toString(),
      value: node[valueLabel],
      tooltip: {
        extraCssText: 'max-width:300px; white-space:pre-line',
        formatter: (info: any) => {
          const name = info.name;
          const value = info.value;
          const nameNumber = parseInt(name);
          let user = node.user;
          let cmd = node.command;
          if (name === 'idle') {
            user = 'idle';
            cmd = '';
          }
          return [
            '<div class="tooltip-title">' +
            user +
            '</div>',
            '<div class="tooltip-content">' + (valueType === 'cpu' ? value.toString() : "面积为估算大小") + '<br/>' + cmd + '</div>'
          ].join('');
        }
      },
      children: children,
      itemStyle: itemStyle,
    };
  }
}
