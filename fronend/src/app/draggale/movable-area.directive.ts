import { Directive, ContentChildren, AfterContentInit, ElementRef, QueryList } from '@angular/core';
import { MovableDirective } from './movable.directive';

interface Boundaries {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

@Directive({
  selector: '[appMovableArea]'
})
export class MovableAreaDirective implements AfterContentInit {
   @ContentChildren(MovableDirective) movable: QueryList<MovableDirective>
  private boundaries: Boundaries;

  constructor(private element: ElementRef) { }
   ngAfterContentInit(): void {
    this.movable.forEach(movable => {
      movable.dragStart.subscribe(() => this.measureBoundaries(movable));
      movable.dragMove.subscribe(() => this.maintainBoundaries(movable));
    });
    this.movable.notifyOnChanges();
   }
  private measureBoundaries(movable: MovableDirective) {
    // need: bounding rect of this area + bounding rect of movable
    const viewRect: ClientRect = this.element.nativeElement.getBoundingClientRect();
    const movableClientRect: ClientRect = movable.element.nativeElement.getBoundingClientRect();

    this.boundaries = {
      minX: viewRect.left - movableClientRect.left + movable.position.x,
      maxX: viewRect.right - movableClientRect.right + movable.position.x,
      minY: viewRect.top - movableClientRect.top + movable.position.y,
      maxY: viewRect.bottom - movableClientRect.bottom + movable.position.y,
    };
  }
  private maintainBoundaries(movable: MovableDirective) {
    // movable.position.x = movable.position.x < this.boundaries.minX? this.boundaries.minX : movable.position.x;
    movable.position.x = Math.max(this.boundaries.minX, movable.position.x);
    movable.position.x = Math.min(this.boundaries.maxX, movable.position.x);
    movable.position.y = Math.max(this.boundaries.minY, movable.position.y);
    movable.position.y = Math.min(this.boundaries.maxY, movable.position.y);
  } 
}
