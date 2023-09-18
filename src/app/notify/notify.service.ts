import { Injectable } from '@angular/core';
import { SocketService } from '../socket/socket.service';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor(
    private socketService: SocketService
  ) {}

  connect() {
    const socket = this.socketService.socket;
    socket.on('connect', () => {
      console.log('notify socket connected');
    });
    socket.on('disconnect', () => {
      console.log('notify socket disconnected');
    });
    // message
    socket.on('message', (data) => {
      console.log('message', data);
    });
    socket.connect();
  }

}
