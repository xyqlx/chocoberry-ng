import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'netTraffic'
})
export class NetTrafficPipe implements PipeTransform {

  transform(value: string): string {
    const num = Number(value);
    if (num < 1) {
      return `${(num * 1024).toFixed(0)} B/s`;
    } else if (num < 1024) {
      return `${num.toFixed(0)} KB/s`;
    } else if (num < 100 * 1024) {
      return `${(num / 1024).toFixed(1)} MB/s`;
    } else if (num < 1024 * 1024) {
      return `${(num / 1024).toFixed(0)} MB/s`;
    } else {
      return `${(num / 1024 / 1024).toFixed(0)} GB/s`;
    }
  }

}
