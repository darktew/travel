import { Directive, HostBinding, HostListener, Output, EventEmitter, TemplateRef, Input, ViewContainerRef, ContentChild, ElementRef } from '@angular/core';
import { DraggableHelperDirective } from './draggable-helper.directive';

@Directive({
  selector: '[appDraggale],[appDroppable]'
})
export class DraggaleDirective {
  @HostBinding('class.draggable') draggle = true;
  @HostBinding('class.dragging') dragging = false;
  //Output
  @Output() dragStart = new EventEmitter<PointerEvent>();
  @Output() dragMove = new EventEmitter<PointerEvent>();
  @Output() dragEnd = new EventEmitter<PointerEvent>();

  //@ContentChild(DraggableHelperDirective) helper: DraggableHelperDirective;

  constructor(public element: ElementRef) { }

  @HostListener('pointerdown', ['$event']) 
  onpointerdown(event: PointerEvent): void{
    this.dragging = true;
    event.stopPropagation();
    this.dragStart.emit(event);
    
   // this.helper.onDragStart();
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
     // remove the helper
    // this.viewContainerRef.clear();
  }
}
