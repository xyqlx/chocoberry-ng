import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-multi-progress',
  templateUrl: './multi-progress.component.html',
  styleUrls: ['./multi-progress.component.scss'],
})
export class MultiProgressComponent {
  @Input() progresses: {
    color: string;
    value: number;
  }[] = [];
}
