import { Injectable } from '@angular/core';
import { SocketService } from '../socket/socket.service';
import { update } from "./store/trigger.actions";
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor(
    private socketService: SocketService,
    private store: Store
  ) {}

  connect() {
    const socket = this.socketService.socket;
    socket.on('connect', () => {
      console.log('notify socket connected');
      socket.emit('notify');
    });
    socket.on('disconnect', () => {
      console.log('notify socket disconnected');
    });
    // message
    socket.on('message', (data) => {
      console.log('receive notification');
      this.notify(data);
      this.store.dispatch(update());
    });
    socket.connect();
  }

  notify(message: string) {
    if (!("Notification" in window)) {
      // Check if the browser supports notifications
      alert(message);
    } else if (Notification.permission === "granted") {
      // Check whether notification permissions have already been granted;
      // if so, create a notification
      const notification = new Notification(message);
    } else if (Notification.permission !== "denied") {
      // We need to ask the user for permission
      Notification.requestPermission().then((permission) => {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          const notification = new Notification(message);
        }
        else{
          alert(message);
        }
      });
    } else {
      alert(message);
    }
  }

}
