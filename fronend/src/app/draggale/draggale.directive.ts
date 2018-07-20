import { Directive, HostBinding, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appDraggale]'
})
export class DraggaleDirective {
  @HostBinding('class.draggable') draggle = true;

  //Output
  @Output() dragStart = new EventEmitter<PointerEvent>();
  @Output() dragMove = new EventEmitter<PointerEvent>();
  @Output() dragEnd = new EventEmitter<PointerEvent>();

  @HostBinding('class.dragging') dragging = false;

  @HostListener('pointerdown', ['$event']) 
  onpointerdown(event: PointerEvent): void{
    this.dragging = true;
    event.stopPropagation();
    this.dragStart.emit(event);
  }
  @HostListener('document: pointermove', ['$event']) 
  onpointermove(event: PointerEvent): void{
    if(!this.dragging) {
      return;
    }
    this.dragMove.emit(event);
  }
  @HostListener('document: pointerup', ['$event']) 
  onpointerup(event: PointerEvent): void{
    if(!this.dragging) {
      return;
    }
    this.dragging = false;
    this.dragEnd.emit(event);
  }
  constructor() { }
}
