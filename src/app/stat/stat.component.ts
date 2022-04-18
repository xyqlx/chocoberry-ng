import { Component, OnInit } from '@angular/core';
import { ChocoService } from '../choco/choco.service';

@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.scss']
})
export class StatComponent implements OnInit {

  constructor(private choco: ChocoService) { }
  data: any;
  async ngOnInit() {
    this.data = await this.choco.getAsync('tasks/log/performance?days=1');
  }

}
