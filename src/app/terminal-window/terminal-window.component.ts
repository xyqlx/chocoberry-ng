import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  InjectionToken,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { IDisposable, IEvent, Terminal } from 'xterm';
import { Subscription } from 'rxjs';
import { SocketService } from '../socket/socket.service';

export const CLOSE_EVENT = new InjectionToken<{}>('CLOSE_EVENT');
export const SSH_PASSWORD = new InjectionToken<{}>('SSH_PASSWORD');

@Component({
  selector: 'app-terminal-window',
  templateUrl: './terminal-window.component.html',
  styleUrls: ['./terminal-window.component.scss'],
})
export class TerminalWindowComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  constructor(
    @Inject(CLOSE_EVENT) public closeEvent: any,
    @Inject(SSH_PASSWORD) public password: string,
    private socketService: SocketService
  ) {}
  @ViewChild('term', { static: true }) terminalDiv?: ElementRef;
  term?: Terminal;
  ngOnInit(): void {
    this.socketService.socket.connect();
    this.term = new Terminal();
    if (this.terminalDiv) {
      this.term.open(this.terminalDiv.nativeElement);
    }
  }
  ngOnDestroy(): void {
    this.socketService.socket.removeAllListeners();
  }
  ngAfterViewInit(): void {
    if (!this.term) {
      return;
    }
    const socket = this.socketService.socket;
    const action = () => {
      console.log('socket connected');
      this.term?.write('\r\n*** Connected to backend***\r\n');
      this.term?.onData((data) => {
        socket.emit('data', data);
      });
      socket.on('data', (data) => {
        this.term?.write(data);
      });
      socket.on('disconnect', () => {
        this.term?.write('\r\n*** Disconnected from backend***\r\n');
      });
    };
    this.socketService.socket.emit('ssh_login', this.password);
    socket.on('connect', action);
  }

  close() {
    this.socketService.socket.disconnect();
    this.closeEvent();
  }
}
