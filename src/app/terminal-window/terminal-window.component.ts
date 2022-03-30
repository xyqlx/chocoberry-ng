import { AfterViewInit, Component, Inject, InjectionToken, OnInit, ViewChild } from '@angular/core';
import { FunctionsUsingCSI, NgTerminal } from 'ng-terminal';
import { Socket } from 'ngx-socket-io';

export const CLOSE_EVENT = new InjectionToken<{}>('CLOSE_EVENT');

@Component({
  selector: 'app-terminal-window',
  templateUrl: './terminal-window.component.html',
  styleUrls: ['./terminal-window.component.scss']
})
export class TerminalWindowComponent implements OnInit, AfterViewInit {

  constructor(@Inject(CLOSE_EVENT) public closeEvent: any, private socket: Socket) { }
  @ViewChild('term', { static: true }) child: NgTerminal | undefined;
  ngOnInit(): void {
    this.socket.connect();
    this.socket.emit('close');
    this.socket.fromEvent('close').subscribe(x=>console.log(x));
  }
  ngAfterViewInit(): void {
    if(!this.child){
      return;
    }
    this.child?.write(FunctionsUsingCSI.cursorColumn(1) + '$ ');
    this.child.keyEventInput.subscribe(e => {
      console.log('keyboard event:' + e.domEvent.code + ', ' + e.key);

      const ev = e.domEvent;
      const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;

      if (ev.code === 'Enter' || ev.code === 'NumpadEnter') {
        this.child?.write('\n' + FunctionsUsingCSI.cursorColumn(1) + '$ '); // \r\n
      } else if (ev.code === 'Backspace') {
        if (this.child && this.child.underlying.buffer.active.cursorX > 2) {
          this.child.write('\b \b');
        }
      } else if (printable) {
        this.child?.write(e.key);
      }
    })
  }
  close(){
    this.closeEvent();
  }

}
