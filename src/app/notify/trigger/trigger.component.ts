import { Component, Input, OnInit } from '@angular/core';
import { Trigger } from '../trigger';

@Component({
  selector: 'app-trigger',
  templateUrl: './trigger.component.html',
  styleUrls: ['./trigger.component.scss']
})
export class TriggerComponent implements OnInit {

  constructor() { }

  @Input() trigger: Trigger = new Trigger('time', 1, {}, 'email', new Date().getTime());

  ngOnInit(): void {
  }

}
