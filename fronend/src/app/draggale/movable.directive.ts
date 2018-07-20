import { Directive, HostListener, HostBinding, Input, ElementRef } from '@angular/core';
import { DraggaleDirective } from './draggale.directive';
import { DomSanitizer, SafeStyle } from '../../../node_modules/@angular/platform-browser';

interface Position {
  x: number;
  y: number;
}

@Directive({
  selector: '[appMovable]'
})
export class MovableDirective extends DraggaleDirective {
  //Host Binding
  @HostBinding('style.transform') get transform(): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(
      `translateX(${this.position.x}px) translateY(${this.position.y}px)`
    );
  }
  @HostBinding('class.movable') movable = true;
  // set Position
  position: Position = { x: 0, y: 0 };
  private startPosition: Position;
  @Input('appMovableReset') reset = false;
  constructor(private sanitizer: DomSanitizer,public element: ElementRef) {
    super();
  }
 // HostListener
  @HostListener('dragStart', ['$event'])
  ondragstart(event: PointerEvent) {
    this.startPosition = {
      x: event.clientX - this.position.x,
      y: event.clientY - this.position.y
    }
  }
  @HostListener('dragMove', ['$event'])
  ondragmove(event: PointerEvent) {
    this.position.x = event.clientX - this.startPosition.x;
    this.position.y = event.clientY - this.startPosition.y;
  }
  @HostListener('dragEnd', ['$event'])
  ondragend(event: PointerEvent) {
    if (this.reset) {
      this.position = {x: 0, y: 0};
    }
  }

}
