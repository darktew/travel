import { Directive, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { DraggaleDirective } from './draggale.directive';
import { Overlay, OverlayRef, GlobalPositionStrategy } from '../../../node_modules/@angular/cdk/overlay';
import { TemplatePortal } from '../../../node_modules/@angular/cdk/portal';

@Directive({
  selector: '[appDraggableHelper]',
  exportAs: 'addDraggableHelper'
})
export class DraggableHelperDirective implements OnInit, OnDestroy {
  private overlayRef: OverlayRef;
  private positionStrategy = new GlobalPositionStrategy();
  private startPosition?: { x: number; y: number; };
  constructor(private draggable: DraggaleDirective,
              private templateRef: TemplateRef<any>,
              private viewContainerRef: ViewContainerRef,
              private overlay: Overlay) { }

  ngOnInit(): void{
    this.draggable.dragStart.subscribe(event=> this.onDragStart(event));
    this.draggable.dragMove.subscribe(event => this.onDragMove(event));
    this.draggable.dragEnd.subscribe(()=> this.onDragEnd());
    // create an overlay....
    this.overlayRef =  this.overlay.create({
      positionStrategy: this.positionStrategy,
      panelClass: 'draggable-helper-overlay'
    });
  }
  ngOnDestroy(): void{
    this.overlayRef.dispose();
  }
  private onDragStart(event: PointerEvent): void{
    // determine relative start position
    const clientRect = this.draggable.element.nativeElement.getBoundingClientRect();
    this.startPosition = {
      x: event.clientX - clientRect.left,
      y: event.clientY - clientRect.top
    };
  }

  private onDragMove(event: PointerEvent): void{
    if (!this.overlayRef.hasAttached()) {
       //render the helper in the overlay
    this.overlayRef.attach(new TemplatePortal(this.templateRef, this.viewContainerRef));
    }
    // position the helper...
    this.positionStrategy.left(`${event.clientX - this.startPosition.x}px`);
    this.positionStrategy.top(`${event.clientY - this.startPosition.y}px`);
    this.positionStrategy.apply(); 
  }

  private onDragEnd(): void{
    // remove the helper form the
    this.overlayRef.detach();
  }
}
