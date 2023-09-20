// define trigger type
type TriggerType = 'time' | 'gpu' | 'process';
type NotifyType = 'notify' | 'email';

class Trigger {
  constructor(
    public type: TriggerType,
    public repeat: number,
    public payload: any,
    public notifyType: NotifyType,
    public created: number
  ) {}
}

const triggerTypes: TriggerType[] = ['gpu', 'time', 'process'];
const notifyTypes: NotifyType[] = ['notify', 'email'];
const triggerTypeLabels = {
  gpu: '显卡占用变动',
  time: '定时',
  process: '进程结束'
}
const notifyTypeLabels = {
  notify: '浏览器通知',
  email: '邮件',
}

class GPUTrigger extends Trigger {
  constructor(
    repeat: number,
    notifyType: NotifyType,
    created: number
  ) {
    super(
      'gpu',
      repeat,
      {},
      notifyType,
      created
    );
  }
}

class TimeTrigger extends Trigger {
  constructor(
    time: number,
    notifyType: NotifyType,
    created: number
  ) {
    super('time', 1, { time }, notifyType, created);
  }
}

class ProcessTrigger extends Trigger {
  constructor(
    processId: number,
    notifyType: NotifyType,
    created: number
  ) {
    super(
      'process',
      1,
      {
        processId,
      },
      notifyType,
      created
    );
  }
}

export {
  Trigger,
  triggerTypes,
  notifyTypes,
  triggerTypeLabels,
  notifyTypeLabels,
  GPUTrigger,
  TimeTrigger,
  ProcessTrigger
};
