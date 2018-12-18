import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class IoService {
  public socket = io('https://localhost:3000');

  constructor(public _notification: NotificationService) { }

  createJob(data) {
    this.socket.on('creajob', ()=> {
        data;
    });
  }

  // status(data) {
  //   console.log(data);
  //   this.socket.on('ChangeStatus', (message)=> {
  //     if (message.message) {
  //       this._notification.generateNotification(data);
  //     } 
  //   });
  
  //}
}
