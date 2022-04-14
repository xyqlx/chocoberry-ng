import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  public socket: Socket;
  constructor() {
    this.socket = io(environment.apiUrl, {
      autoConnect: false,
      auth: {
        token: localStorage.getItem('access_token')
      }
    });
  }
}
