import { Injectable } from '@angular/core';
import { Observable } from '../../../node_modules/rxjs/internal/Observable';
import { Subject } from '../../../node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class DroppableService {
  dragStart$: Observable<PointerEvent>;
  dragEnd$: Observable<PointerEvent>;
  private dragStartSubject = new Subject<PointerEvent>();
  private dragEndSubject = new Subject<PointerEvent>();

  constructor() {
    this.dragStart$ = this.dragStartSubject.asObservable();
    this.dragEnd$ = this.dragEndSubject.asObservable();
  }

  onDragStart(event: PointerEvent) {
    this.dragStartSubject.next(event);
  }

  onDragEnd(event: PointerEvent) {
    this.dragEndSubject.next(event);
  }
}
