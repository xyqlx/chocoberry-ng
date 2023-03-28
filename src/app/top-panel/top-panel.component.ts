import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { ChocoService } from '../choco/choco.service';
import { ECharts, EChartsOption } from 'echarts';
import { ProcessColorService } from '../color-generator/process-color.service';

// create a note type
type ProcessNode = {
  pid: number,
  ppid: number,
  cpu: number,
  mem: number,
  sum_cpu: number,
  sum_mem: number,
  children: ProcessNode[],
};

@Component({
  selector: 'app-top-panel',
  templateUrl: './top-panel.component.html',
  styleUrls: ['./top-panel.component.scss'],
})
export class TopPanelComponent implements OnInit, OnDestroy {
  topSubscription: Subscription;
  topInfo: {
    'PID': number,
    'USER': string,
    'PR': number,
    'NI': number,
    'VIRT': number,
    'RES': number,
    'SHR': number,
    'S': string,
    '%CPU': number,
    '%MEM': number,
    'TIME+': string,
    'COMMAND': string,
  }[] = [];
  psInfo: {
    'PID': number,
    'USER': string,
    'PPID': number,
    '%CPU': number,
    '%MEM': number,
    'CMD': string,
  }[] = [];
  cpuInfo: any;
  memInfo: any;
  displayedColumns = ['command', 'user', 'cpu', 'mem'];
  shouldUpdate = true;
  chartOption?: EChartsOption;
  chart?: ECharts;
  constructor(
    private choco: ChocoService,
    private processColor: ProcessColorService,
    ) {
    const source = interval(5000);
    this.topSubscription = source.subscribe(async () => {
      await this.queryCPU();
      await this.queryMem();
      if (this.shouldUpdate) {
        await this.queryTop();
        await this.queryPS();
        // this.updateCPUChart();
        this.calcTree();
      }
    });
  }
  continueUpdate() {
    this.shouldUpdate = true;
  }
  stopUpdate() {
    this.shouldUpdate = false;
  }

  async queryPS(){
    const psInfo = (await this.choco.getAsync(`process/ps`)) as {
      'PID': string,
      'USER': string,
      'PPID': string,
      '%CPU': string,
      '%MEM': string,
      'CMD': string,
    }[];
    this.psInfo = psInfo.map((item) => {
      return {
        'PID': parseInt(item.PID),
        'USER': item.USER,
        'PPID': parseInt(item.PPID),
        '%CPU': parseFloat(item['%CPU']),
        '%MEM': parseFloat(item['%MEM']),
        'CMD': item.CMD,
      };
    });
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
      default:
        return num;
    }
  }
  async queryTop() {
    const topInfo = await this.choco.getAsync(`process/top`) as {
      'PID': string, 'USER': string, 'PR': string, 'NI': string, 'VIRT': string, 'RES': string, 'SHR': string, 'S': string, '%CPU': string, '%MEM': string, 'TIME+': string, 'COMMAND': string,
    }[];
    this.topInfo = topInfo.map((item) => {
      return {
        'PID': parseInt(item.PID),
        'USER': item.USER,
        'PR': parseInt(item.PR),
        'NI': parseInt(item.NI),
        'VIRT': this.toFloatWithUnit(item.VIRT),
        'RES': this.toFloatWithUnit(item.RES),
        'SHR': this.toFloatWithUnit(item.SHR),
        'S': item.S,
        '%CPU': parseFloat(item['%CPU']),
        '%MEM': parseFloat(item['%MEM']),
        'TIME+': item['TIME+'],
        'COMMAND': item.COMMAND,
      };
    });
  }
  async queryCPU() {
    this.cpuInfo = await this.choco.getAsync(`cpu`);
  }
  async queryMem() {
    this.memInfo = await this.choco.getAsync(`memory`);
  }

  ngOnInit(): void {}
  ngOnDestroy() {
    this.topSubscription.unsubscribe();
  }

  onChartInit(ec: ECharts) {
    this.chart = ec;
  }

  calcTree() {
    // 根据cpuInfo.percent计算空闲CPU使用率，注意核心数
    const cpuIdle = 100 * (1 - this.cpuInfo.percent / 100) * this.cpuInfo.logicCores;
    // 将psInfo转换为Map，方便查找
    const psInfoMap = new Map<number, {
      'PID': number, 'USER': string, 'PPID': number, '%CPU': number, '%MEM': number, 'CMD': string,
    }>();
    this.psInfo.forEach((item) => {
      psInfoMap.set(item.PID, item);
    });
    // 构造一个反向的Map，方便查找子进程
    const psInfoMapReverse = new Map<number, number[]>();
    for (let [key, value] of psInfoMap) {
      if (psInfoMapReverse.has(value.PPID)) {
        (psInfoMapReverse.get(value.PPID) as number[]).push(key);
      } else {
        psInfoMapReverse.set(value.PPID, [key]);
      }
    }
    // 根据PID和PPID的关系构造一颗树
    const tree = this.buildTree(0, -1, psInfoMap, psInfoMapReverse);
    // 包装树节点，用于生成图表
    const treeData = this.wrapTree(tree, 'cpu');
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
          leafDepth: 7,
          tooltip: {
            extraCssText: 'max-width:300px; white-space:pre-line',
            formatter: (info) => {
              const name = info.name;
              const value = info.value;
              const nameNumber = parseInt(name);
              let user = psInfoMap.get(nameNumber)?.USER;
              let cmd = psInfoMap.get(nameNumber)?.CMD;
              if(name === 'idle') {
                user = 'idle';
                cmd = '';
              }
              return [
                '<div class="tooltip-title">' +
                  user +
                  '</div>',
                  '<div class="tooltip-content">' + value.toString() + '<br/>' + cmd + '</div>'
              ].join('');
            }
          },
          animationDuration: 550,
          animationDurationUpdate: 750
        }
      ]
    }
  }

  // 包装树节点，用于生成图表（剪掉小于1的节点）
  wrapTree(node: ProcessNode, valueType: string): { name: string, value: number, children: any, itemStyle?: any } {
    const valueLabel = valueType === 'cpu' ? 'sum_cpu' : 'sum_mem';
    const children = node.children.filter(
      (child) => child[valueLabel] >= 1
    ).map((child) => {
      return this.wrapTree(child, valueType);
    });
    let itemStyle = undefined;
    // 如果能从processColor中找到对应的颜色，就用对应的颜色，否则用随机颜色
    if (this.processColor.colorGenerator.exists(node.pid)) {
      itemStyle = {
          color: this.processColor.colorGenerator.get(node.pid)
      };
    }else{
      const seed = (node.pid % 1000) / 1000;
      itemStyle = {
          color: this.processColor.colorGenerator.tempMapColor(seed)
      };
    }
    return {
      name: node.pid.toString(),
      value: node[valueLabel],
      children: children,
      itemStyle: itemStyle,
    };
  }

  
  buildTree(pid: number, ppid: number, psInfoMap: Map<number, {
    'PID': number, 'USER': string, 'PPID': number, '%CPU': number, '%MEM': number, 'CMD': string,
  }>, psInfoMapReverse: Map<number, number[]>): any {
    const node: ProcessNode = {
      pid: pid,
      ppid: ppid,
      cpu: psInfoMap.get(pid) ? psInfoMap.get(pid)!['%CPU'] : 0,
      mem: psInfoMap.get(pid) ? psInfoMap.get(pid)!['%MEM'] : 0,
      sum_cpu: 0,
      sum_mem: 0,
      children: [],
    };
    if (psInfoMapReverse.has(pid)) {
      const pids = psInfoMapReverse.get(pid) as number[];
      pids.forEach((id) => {
        const child = this.buildTree(id, pid, psInfoMap, psInfoMapReverse);
        node.children.push(child);
        node.sum_cpu += child.sum_cpu + child.cpu;
        node.sum_mem += child.sum_mem + child.mem;
      });
    }
    return node;
}

  updateCPUChart() {
    // 根据cpuInfo.percent计算空闲CPU使用率，注意核心数
    const cpuIdle = 100 * (1 - this.cpuInfo.percent / 100) * this.cpuInfo.logicCores;
    // 过滤出top中CPU使用率大于1的进程
    const topCPU = this.topInfo.filter((item) => item['%CPU'] > 1);
    // 将psInfo转换为Map，方便查找
    const psInfoMap = new Map<number, {
      'PID': number, 'USER': string, 'PPID': number, '%CPU': number, '%MEM': number, 'CMD': string,
    }>();
    this.psInfo.forEach((item) => {
      psInfoMap.set(item.PID, item);
    });
    // 获得PPID和其子进程CPU使用率之和的映射
    const ppidCPU = new Map<number, number>();
    topCPU.forEach((item) => {
      const ppid = psInfoMap.get(item.PID)?.PPID || 0;
      ppidCPU.set(ppid, (ppidCPU.get(ppid) || 0) + item['%CPU']);
    });
    // PPID和其子进程CPU使用率之和的饼状图
    this.chartOption = {
      title: {
        text: 'CPU使用率',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: 'CPU使用率',
          type: 'pie',
          radius: '55%',
          data: Array.from(ppidCPU.entries()).map((item) => {
            return {
              name: psInfoMap.get(item[0])?.USER || '未知',
              value: item[1],
            };
          }).concat({
            name: '空闲',
            value: cpuIdle,
          }),
        },
      ],
    }
  }
}
