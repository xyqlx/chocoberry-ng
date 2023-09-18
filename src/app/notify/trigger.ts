class Trigger {
  constructor(
    public type: string,
    public repeat: number,
    public payload: any,
    public notifyType: string,
    public created: number
  ) {}
}

const triggerTypes = ['specific_gpu_free', 'time'];
const notifyTypes = ['notify', 'email'];

class SpecificGPUFreeTrigger extends Trigger {
  constructor(
    userId: string,
    repeat: number,
    gpuIndex: number,
    notifyType: string,
    created: number
  ) {
    super(
      'specific_gpu_free',
      repeat,
      {
        gpuIndex,
      },
      notifyType,
      created
    );
  }
}

class TimeTrigger extends Trigger {
  constructor(
    repeat: number,
    time: number,
    notifyType: string,
    created: number
  ) {
    super('time', repeat, { time }, notifyType, created);
  }
}

export {
  Trigger,
  triggerTypes,
  notifyTypes,
  SpecificGPUFreeTrigger,
  TimeTrigger,
};
