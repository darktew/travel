import { Directive, OnInit, HostBinding, HostListener, Output, EventEmitter, SkipSelf } from '@angular/core';
import { DroppableService } from './droppable.service';

@Directive({
  selector: '[appDropzone]',
  providers: [DroppableService]
})
export class DropzoneDirective implements OnInit {
  //Host Binding
  @HostBinding('class.dropzone-activated') activated = false;
  @HostBinding('class.dropzone-entered') entered = false;

  //output
  @Output() drop = new EventEmitter<PointerEvent>();
  @Output() remove = new EventEmitter<PointerEvent>();
  constructor(@SkipSelf() private globaldroppableService: DroppableService,
              private innerdroppableService: DroppableService) { }

  ngOnInit(): void {
    this.globaldroppableService.dragStart$.subscribe(() => this.onDragStart());
    this.globaldroppableService.dragEnd$.subscribe( event => this.onDragEnd(event));

    this.innerdroppableService.dragStart$.subscribe(() => this.onInnerDragStart());
    this.innerdroppableService.dragEnd$.subscribe( event => this.onInnerDragEnd(event));

  }

  //HostListener
  @HostListener('pointerenter') onpointerenter(): void {
    if (!this.activated) {
      return;
    }
    this.entered = true;
  }

  @HostListener('pointerleave') onpointerleave(): void {
    if (!this.activated) {
      return;
    }
    this.entered = false;
  }

  private onDragStart(): void {
    this.activated = true;
  }
  private onDragEnd(event: PointerEvent): void {
    if (!this.activated) {
      return;
    }
    if (this.entered) {
      // we have a drop
      this.drop.emit(event);
    }
    this.activated = false;
    this.entered = false;
  }
  private onInnerDragStart() {
    this.entered = true;
    this.activated = true;
  }

  private onInnerDragEnd(event: PointerEvent) {
    if (!this.entered) {
      this.remove.emit(event);
    }
    this.entered = false;
    this.activated = false;
  }
}
